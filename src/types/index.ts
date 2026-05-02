export type Role = "client" | "employee" | "superadmin";

export type OrderSource = "web" | "pos" | "branch" | "manual";

export type OrderStatus =
  | "cotizacion"
  | "confirmado"
  | "recolectado"
  | "en_proceso"
  | "control_calidad"
  | "listo"
  | "entregado"
  | "cancelado";

export type PaymentMethod =
  | "efectivo"
  | "transferencia"
  | "yape"
  | "izipay"
  | "pendiente";

export type PaymentStatus = "pendiente" | "pagado" | "fallido" | "reembolsado";

export type ServiceCategory =
  | "frazada_1p"
  | "frazada_15p"
  | "edredon"
  | "ropa_industrial"
  | "otro";

export type DeliveryDestination = "planta" | "domicilio" | "sucursal";

export type BillingCycle = "semanal" | "quincenal" | "mensual" | "personalizado";

export type TransactionType = "ingreso" | "egreso";

export type TransactionCategory =
  | "venta"
  | "liquidacion_sucursal"
  | "gasto_operativo"
  | "gasto_movilidad"
  | "gasto_insumos"
  | "otro";

export type VehicleType = "recojo" | "entrega" | "ambos";

export type DeliveryType = "recojo" | "entrega" | "ambos";

export type DeliveryStatus = "pendiente" | "en_ruta" | "completado" | "fallido";

export type SettlementStatus = "pendiente" | "pagado" | "anulado";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  phone: string | null;
  company_name: string | null;
  ruc: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_desc: string | null;
  base_price: number;
  category: ServiceCategory;
  image_url: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ClientPricing {
  id: string;
  client_id: string;
  service_id: string;
  custom_price: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  contact_person: string | null;
  commission_percent: number;
  billing_cycle: BillingCycle;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  client_id: string | null;
  branch_id: string | null;
  source: OrderSource;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  igv: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  izipay_txn_id: string | null;
  delivery_destination: DeliveryDestination;
  delivery_address: string | null;
  delivery_branch_id: string | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  vehicle_id: string | null;
  walk_in_name: string | null;
  walk_in_phone: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  status_logs?: OrderStatusLog[];
  client?: Profile;
  branch?: Branch;
}

export interface OrderItem {
  id: string;
  order_id: string;
  service_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  service?: Service;
}

export interface OrderStatusLog {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  payment_method: PaymentMethod;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  created_by: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  name: string | null;
  type: VehicleType;
  driver_name: string | null;
  driver_phone: string | null;
  active: boolean;
  created_at: string;
}

export interface Delivery {
  id: string;
  vehicle_id: string;
  type: DeliveryType;
  status: DeliveryStatus;
  scheduled_date: string;
  actual_date: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  vehicle?: Vehicle;
  items?: DeliveryItem[];
}

export interface DeliveryItem {
  id: string;
  delivery_id: string;
  order_id: string;
  location_type: string;
  location_id: string | null;
  address: string | null;
  completed: boolean;
  notes: string | null;
}

export interface BranchSettlement {
  id: string;
  branch_id: string;
  period_start: string;
  period_end: string;
  total_orders_amount: number;
  commission_amount: number;
  status: SettlementStatus;
  transaction_id: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  paid_at: string | null;
  branch?: Branch;
  items?: BranchSettlementItem[];
}

export interface BranchSettlementItem {
  id: string;
  settlement_id: string;
  order_id: string;
  order_amount: number;
  commission_pct: number;
  commission_amt: number;
  order?: Order;
}

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  discount_percent: number;
  valid_from: string;
  valid_until: string;
  target_clients: string[] | null;
  target_services: string[] | null;
  created_by: string;
  sent_at: string | null;
  created_at: string;
}

export interface Permission {
  id: string;
  slug: string;
  description: string | null;
}

export interface EmployeePermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted_by: string | null;
  created_at: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  cotizacion: "Cotización",
  confirmado: "Confirmado",
  recolectado: "Recolectado",
  en_proceso: "En Proceso",
  control_calidad: "Control de Calidad",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  yape: "Yape",
  izipay: "Izipay",
  pendiente: "Pendiente",
};

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  frazada_1p: "Frazada 1 Plaza",
  frazada_15p: "Frazada 1.5 Plazas",
  edredon: "Edredón",
  ropa_industrial: "Ropa Industrial",
  otro: "Otro",
};

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  venta: "Venta",
  liquidacion_sucursal: "Liquidación Sucursal",
  gasto_operativo: "Gasto Operativo",
  gasto_movilidad: "Gasto Movilidad",
  gasto_insumos: "Gasto Insumos",
  otro: "Otro",
};

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}
