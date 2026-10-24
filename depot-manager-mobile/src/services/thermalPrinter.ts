import { Linking } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { SaleTransaction } from '../types/models';
import { formatFcfa } from '../theme/tokens';

export type PaperWidthMm = 58 | 80;

/**
 * Formate le buffer texte ESC/POS pour les imprimantes thermiques Bluetooth de ceinture ou comptoir
 * (ex: RPP02N, POS-58BT, Xprinter 80mm).
 */
export function buildEscPosReceiptPayload(sale: SaleTransaction, widthMm: PaperWidthMm = 58): string {
  const cols = widthMm === 80 ? 48 : 32;
  const divider = '-'.repeat(cols);

  const lines: string[] = [
    'DEPOT CENTRAL AKWA',
    'DOUALA - CAMEROUN',
    'RC/DLA/2018/B/452',
    divider,
    `RECU : ${sale.invoiceNumber}`,
    `DATE : ${sale.timeLabel}`,
    `CAISSE : ${sale.stationName}`,
    `VENDEUR : ${sale.operatorName}`,
    `CLIENT : ${sale.clientName}`,
    divider,
  ];

  for (const item of sale.items) {
    lines.push(`${item.productName}`);
    lines.push(
      `  ${item.quantityCrates}c x ${item.unitCratePriceFcfa} = ${item.lineSubtotalFcfa} F`
    );
    if (item.unreturnedCrates > 0) {
      lines.push(`  + Consigne ${item.unreturnedCrates}c : +${item.depositChargedFcfa} F`);
    }
  }

  lines.push(divider);
  lines.push(`SOUS-TOTAL : ${formatFcfa(sale.beveragesSubtotalFcfa)}`);
  if (sale.depositTotalFcfa > 0) {
    lines.push(`CONSIGNES  : +${formatFcfa(sale.depositTotalFcfa)}`);
  }
  lines.push(`TOTAL NET  : ${formatFcfa(sale.grandTotalFcfa)}`);

  if (sale.status === 'credit') {
    lines.push(divider);
    lines.push('MODE : VENTE A CREDIT (A TERME)');
    lines.push(`RESTE DU : ${formatFcfa(sale.balanceDueFcfa)}`);
    if (sale.dueDateLabel) {
      lines.push(`ECHEANCE : ${sale.dueDateLabel}`);
    }
  } else {
    lines.push(`MODE : ${sale.paymentChannelLabel}`);
    lines.push(`RECU : ${formatFcfa(sale.amountReceivedFcfa)}`);
    lines.push(`MONNAIE : ${formatFcfa(sale.changeReturnedFcfa)}`);
  }

  lines.push(divider);
  lines.push(`PASS QUAI QR : ${sale.invoiceNumber}`);
  lines.push('Marchandise verifiee au quai.');
  lines.push('\n\n');

  return lines.join('\n');
}

/**
 * Génère et partage un reçu PDF officiel via la feuille de partage native iOS / Android
 */
export async function exportReceiptPdf(sale: SaleTransaction): Promise<void> {
  const rowsHtml = sale.items
    .map(
      (item) => `
      <tr>
        <td style="padding:6px 0;border-bottom:1px solid #e2e8f0;">
          <strong>${item.productName}</strong><br/>
          <small>${item.bottlesPerCrate} btl/casier</small>
        </td>
        <td style="text-align:center;">${item.quantityCrates} c</td>
        <td style="text-align:right;">${formatFcfa(item.lineSubtotalFcfa)}</td>
      </tr>`
    )
    .join('');

  const html = `
    <html>
      <body style="font-family: -apple-system, Roboto, sans-serif; padding: 24px; color: #0B1C30;">
        <h2 style="margin:0;color:#00254B;">DÉPÔT CENTRAL AKWA</h2>
        <p style="margin:4px 0 16px;font-size:12px;color:#43474F;">
          Douala, Cameroun • Facture ${sale.invoiceNumber} • ${sale.timeLabel}
        </p>
        <p style="font-size:13px;">
          <strong>Client :</strong> ${sale.clientName} (${sale.clientPhone})<br/>
          <strong>Opérateur :</strong> ${sale.operatorName} (${sale.stationName})
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:12px;">
          <thead>
            <tr style="border-bottom:2px solid #00254B;text-align:left;">
              <th>Désignation</th>
              <th style="text-align:center;">Qté</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <h3 style="text-align:right;margin-top:16px;color:#00254B;">
          TOTAL : ${formatFcfa(sale.grandTotalFcfa)}
        </h3>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Reçu ${sale.invoiceNumber}`,
    });
  }
}

/**
 * Ouvre directement WhatsApp avec le récapitulatif certifié de la vente pour le client (+237)
 */
export async function shareSaleOnWhatsApp(sale: SaleTransaction): Promise<void> {
  const cleanPhone = sale.clientPhone.replace(/[^0-9]/g, '');
  const itemsSummary = sale.items
    .map((i) => `• ${i.quantityCrates}c ${i.productName} : ${formatFcfa(i.lineSubtotalFcfa)}`)
    .join('\n');

  const text = [
    `*DÉPÔT CENTRAL AKWA - REÇU ${sale.invoiceNumber}*`,
    `Client : ${sale.clientName}`,
    `Date : ${sale.timeLabel}`,
    '',
    itemsSummary,
    sale.depositTotalFcfa > 0 ? `• Consignes casiers : +${formatFcfa(sale.depositTotalFcfa)}` : '',
    '---------------------------',
    `*TOTAL : ${formatFcfa(sale.grandTotalFcfa)}*`,
    sale.status === 'credit'
      ? `*STATUT : À CRÉDIT (Reste dû : ${formatFcfa(sale.balanceDueFcfa)})*`
      : `*STATUT : PAYÉ (${sale.paymentChannelLabel})*`,
    '',
    'Pass sortie quai validé. Merci de votre fidélité !',
  ]
    .filter(Boolean)
    .join('\n');

  const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    await Linking.openURL(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`);
  }
}
