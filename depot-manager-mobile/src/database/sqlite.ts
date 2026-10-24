import * as SQLite from 'expo-sqlite';
import { Product, SaleTransaction } from '../types/models';

const DB_NAME = 'depot_manager_akwa_v2.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbInstance;
}

/**
 * Initialise les tables SQLite locales pour garantir un fonctionnement 100 % hors-ligne
 * (quais de déchargement, coupures réseau, tournées de livraison).
 */
export async function initializeLocalDatabase(): Promise<void> {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY NOT NULL,
      sku TEXT NOT NULL,
      barcode TEXT NOT NULL,
      name TEXT NOT NULL,
      brewer TEXT NOT NULL,
      category TEXT NOT NULL,
      packaging_type TEXT NOT NULL,
      bottles_per_crate INTEGER NOT NULL,
      crate_deposit_fcfa INTEGER NOT NULL,
      purchase_price_fcfa INTEGER NOT NULL,
      sale_price_fcfa INTEGER NOT NULL,
      unit_bottle_price_fcfa INTEGER NOT NULL,
      stock_crates INTEGER NOT NULL,
      min_alert_crates INTEGER NOT NULL,
      warehouse_location TEXT NOT NULL,
      active_in_pos INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      district TEXT NOT NULL,
      phone TEXT NOT NULL,
      is_anonymous_counter INTEGER NOT NULL DEFAULT 0,
      credit_balance_fcfa INTEGER NOT NULL DEFAULT 0,
      credit_limit_fcfa INTEGER NOT NULL DEFAULT 0,
      crates_owed INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY NOT NULL,
      invoice_number TEXT NOT NULL UNIQUE,
      created_at_iso TEXT NOT NULL,
      client_id TEXT NOT NULL,
      operator_name TEXT NOT NULL,
      station_name TEXT NOT NULL,
      status TEXT NOT NULL,
      payment_channel TEXT NOT NULL,
      beverages_subtotal_fcfa INTEGER NOT NULL,
      deposit_total_fcfa INTEGER NOT NULL,
      grand_total_fcfa INTEGER NOT NULL,
      amount_received_fcfa INTEGER NOT NULL,
      change_returned_fcfa INTEGER NOT NULL,
      balance_due_fcfa INTEGER NOT NULL,
      due_date_label TEXT,
      payload_json TEXT NOT NULL,
      synced_to_server INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      action TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0
    );
  `);
}

/**
 * Transaction atomique de vente au comptoir ou à crédit :
 * 1. Décrémente les casiers physiques en stock
 * 2. Met à jour l'encours client et les casiers consignés non rendus
 * 3. Enregistre la facture et l'ajoute à la file de synchronisation LAN Akwa
 */
export async function persistSaleOfflineTransaction(sale: SaleTransaction): Promise<void> {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    for (const line of sale.items) {
      await db.runAsync(
        `UPDATE products
         SET stock_crates = MAX(0, stock_crates - ?),
             updated_at = ?
         WHERE id = ?`,
        [line.quantityCrates, sale.createdAtIso, line.productId]
      );
    }

    if (sale.balanceDueFcfa > 0) {
      const unreturnedCrates = sale.items.reduce((sum, item) => sum + item.unreturnedCrates, 0);
      await db.runAsync(
        `UPDATE clients
         SET credit_balance_fcfa = credit_balance_fcfa + ?,
             crates_owed = crates_owed + ?
         WHERE id = ?`,
        [sale.balanceDueFcfa, unreturnedCrates, sale.clientId]
      );
    }

    const payloadJson = JSON.stringify(sale);

    await db.runAsync(
      `INSERT INTO sales (
        id, invoice_number, created_at_iso, client_id, operator_name, station_name,
        status, payment_channel, beverages_subtotal_fcfa, deposit_total_fcfa,
        grand_total_fcfa, amount_received_fcfa, change_returned_fcfa,
        balance_due_fcfa, due_date_label, payload_json, synced_to_server
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        sale.id,
        sale.invoiceNumber,
        sale.createdAtIso,
        sale.clientId,
        sale.operatorName,
        sale.stationName,
        sale.status,
        sale.paymentChannel,
        sale.beveragesSubtotalFcfa,
        sale.depositTotalFcfa,
        sale.grandTotalFcfa,
        sale.amountReceivedFcfa,
        sale.changeReturnedFcfa,
        sale.balanceDueFcfa,
        sale.dueDateLabel ?? null,
        payloadJson,
      ]
    );

    await db.runAsync(
      `INSERT INTO sync_queue (entity_type, entity_id, action, payload_json, created_at)
       VALUES ('SALE', ?, 'CREATE', ?, ?)`,
      [sale.id, payloadJson, sale.createdAtIso]
    );
  });
}

export async function upsertProductOffline(product: Product): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT OR REPLACE INTO products (
      id, sku, barcode, name, brewer, category, packaging_type,
      bottles_per_crate, crate_deposit_fcfa, purchase_price_fcfa,
      sale_price_fcfa, unit_bottle_price_fcfa, stock_crates,
      min_alert_crates, warehouse_location, active_in_pos, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.id,
      product.sku,
      product.barcode,
      product.name,
      product.brewer,
      product.category,
      product.packagingType,
      product.bottlesPerCrate,
      product.crateDepositFcfa,
      product.purchasePriceFcfa,
      product.salePriceFcfa,
      product.unitBottlePriceFcfa,
      product.stockCrates,
      product.minAlertCrates,
      product.warehouseLocation,
      product.activeInPos ? 1 : 0,
      now,
    ]
  );
}
