export type StudioTabId = 'simulator' | 'folder' | 'comparison' | 'deploy';

export type PlatformOS = 'ios' | 'android';

export type OperatorRole = 'admin' | 'cashier' | 'stock' | 'dock';

export type MobileScreenId =
  | 'splash'
  | 'login'
  | 'session-lock'
  | 'logout-confirm'
  | 'dashboard'
  | 'pos'
  | 'payment'
  | 'receipt'
  | 'thermal-preview'
  | 'sales-journal'
  | 'sale-detail'
  | 'stock-catalog'
  | 'product-detail'
  | 'product-form'
  | 'deactivate-sheet'
  | 'clients';

export type BeverageCategory = 'bieres' | 'gazeuses' | 'eaux' | 'vins';

export type PaymentChannel = 'cash' | 'om' | 'momo' | 'credit';

export type SaleStatus = 'paid' | 'credit' | 'cancelled';

export interface OperatorProfile {
  id: string;
  initials: string;
  fullName: string;
  email: string;
  role: OperatorRole;
  roleLabel: string;
  stationLabel: string;
  pinCode: string;
  shiftStart: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  brewer: string;
  category: BeverageCategory;
  categoryLabel: string;
  volumeLabel: string;
  packagingType: 'consigne' | 'perdu';
  bottlesPerCrate: number;
  crateDepositFcfa: number;
  purchasePriceFcfa: number;
  salePriceFcfa: number;
  unitBottlePriceFcfa: number;
  stockCrates: number;
  minAlertCrates: number;
  maxDockCrates: number;
  warehouseLocation: string;
  lastRestockLabel: string;
  cratesOutWithClients: number;
  activeInPos: boolean;
  favorite?: boolean;
  artworkKey: 'castel' | 'beaufort' | 'guinness' | 'tangui' | 'top' | 'export33' | 'kadji';
}

export interface ClientAccount {
  id: string;
  code: string;
  initials: string;
  name: string;
  district: string;
  phone: string;
  isAnonymousCounter: boolean;
  creditBalanceFcfa: number;
  creditLimitFcfa: number;
  cratesOwed: number;
  tierLabel: string;
}

export interface CartEntry {
  productId: string;
  quantityCrates: number;
  returnedCrates: number;
}

export interface SaleLineRecord {
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

export interface SaleRecord {
  id: string;
  invoiceNumber: string;
  dateTimeLabel: string;
  shortTime: string;
  periodTag: 'today' | 'yesterday' | 'week';
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientDistrict: string;
  operatorName: string;
  stationName: string;
  supervisorName: string;
  status: SaleStatus;
  paymentChannel: PaymentChannel;
  paymentChannelLabel: string;
  items: SaleLineRecord[];
  beveragesSubtotalFcfa: number;
  depositTotalFcfa: number;
  grandTotalFcfa: number;
  amountReceivedFcfa: number;
  changeReturnedFcfa: number;
  balanceDueFcfa: number;
  dueDateLabel?: string;
  cancelReason?: string;
  cancelledBy?: string;
}

export interface ProjectFileEntry {
  relativePath: string;
  sizeBytes: number;
  language: string;
  content: string;
}

export interface ScreenCatalogMeta {
  id: MobileScreenId;
  group: string;
  title: string;
  mobileFile: string;
  summary: string;
  nativeModules: string[];
}
