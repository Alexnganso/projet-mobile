import NetInfo from '@react-native-community/netinfo';
import { getDb } from '../database/sqlite';

const AKWA_LOCAL_NODE_URL = 'http://192.168.10.10:4000/api/v1/sync';

/**
 * Écoute les changements de connectivité Wi-Fi LAN / 4G Cameroun sur iOS & Android
 * et vide automatiquement la file d'attente SQLite dès que le Serveur Local Akwa répond.
 */
export function startHybridSyncListener(): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      flushPendingSyncQueue().catch(() => {
        // Silencieux en arrière-plan : les écritures restent protégées dans SQLite
      });
    }
  });

  return unsubscribe;
}

export async function flushPendingSyncQueue(): Promise<{ syncedCount: number }> {
  const db = await getDb();
  const pendingRows = await db.getAllAsync<{
    id: number;
    entity_type: string;
    entity_id: string;
    action: string;
    payload_json: string;
  }>(`SELECT id, entity_type, entity_id, action, payload_json FROM sync_queue ORDER BY id ASC LIMIT 50`);

  if (pendingRows.length === 0) {
    return { syncedCount: 0 };
  }

  let syncedCount = 0;

  for (const row of pendingRows) {
    try {
      const response = await fetch(AKWA_LOCAL_NODE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: row.entity_type,
          entityId: row.entity_id,
          action: row.action,
          payload: JSON.parse(row.payload_json),
        }),
      });

      if (response.ok) {
        await db.runAsync(`DELETE FROM sync_queue WHERE id = ?`, [row.id]);
        if (row.entity_type === 'SALE') {
          await db.runAsync(`UPDATE sales SET synced_to_server = 1 WHERE id = ?`, [row.entity_id]);
        }
        syncedCount++;
      }
    } catch {
      await db.runAsync(`UPDATE sync_queue SET attempts = attempts + 1 WHERE id = ?`, [row.id]);
      break;
    }
  }

  return { syncedCount };
}
