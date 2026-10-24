export type OperatorRole = 'admin' | 'cashier' | 'stock' | 'dock';

export type ProductCategory = 'bieres' | 'gazeuses' | 'eaux' | 'vins';

export type PackagingType = 'consigne' | 'perdu';

export type PaymentChannel = 'cash' | 'om' | 'momo' | 'credit';

export type SaleStatus = 'paid' | 'credit' | 'cancelled';

export interface OperatorProfile {
  id: string;
  fullName: string;
  email: string;
  role: OperatorRole;
  roleLabel: string;
  stationLabel: string;
  pinCode: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  brewer: string;
  category: ProductCategory;
  categoryLabel: string;
  volumeLabel: string;
  packagingType: PackagingType;
  bottlesPerCrate: number;
  crateDepositFcfa: number;
  purchasePriceFcfa: number; // Strictement masqué aux rôles non-admin
  salePriceFcfa: number;
  unitBottlePriceFcfa: number;
  stockCrates: number;
  minAlertCrates: number;
  maxDockCrates: number;
  warehouseLocation: string;
  lastRestockLabel: string;
  cratesOutWithClients: number;
  activeInPos: boolean;
}

export interface ClientAccount {
  id: string;
  code: string;
  name: string;
  district: string;
  phone: string;
  isAnonymousCounter: boolean;
  creditBalanceFcfa: number;
  creditLimitFcfa: number;
  cratesOwed: number;
  tierLabel: string;
}

export interface CartLine {
  productId: string;
  quantityCrates: number;
  returnedEmptyCrates: number;
}

export interface SaleLineItem {
  productId: string;
  productName: string;
  bottlesPerCrate: number;
  quantityCrates: number;
  unitCratePriceFcfa: number;
  returnedCrates: number;
  unreturnedCrates: number;
  depositChargedFcfa: number;
  lineSubtotalFcfa: number;
}

export interface SaleTransaction {
  id: string;
  invoiceNumber: string;
  createdAtIso: string;
  timeLabel: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientDistrict: string;
  operatorName: string;
  stationName: string;
  status: SaleStatus;
  paymentChannel: PaymentChannel;
  paymentChannelLabel: string;
  items: SaleLineItem[];
  beveragesSubtotalFcfa: number;
  depositTotalFcfa: number;
  grandTotalFcfa: number;
  amountReceivedFcfa: number;
  changeReturnedFcfa: number;
  balanceDueFcfa: number;
  dueDateLabel?: string;
  cancelReason?: string;
  cancelledBy?: string;
  syncedToAkwaServer: boolean;
}
