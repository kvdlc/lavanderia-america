import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  full_name: z.string().min(2, "Nombre requerido"),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  ruc: z.string().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  slug: z.string().min(2, "Slug requerido"),
  description: z.string().optional(),
  long_desc: z.string().optional(),
  base_price: z.number().min(0, "Precio no puede ser negativo"),
  category: z.enum(["frazada_1p", "frazada_15p", "edredon", "ropa_industrial", "otro"]),
  image_url: z.string().url().optional().or(z.literal("")),
  active: z.boolean().default(true),
  display_order: z.number().int().default(0),
});

export const branchSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  address: z.string().optional(),
  phone: z.string().optional(),
  contact_person: z.string().optional(),
  commission_percent: z.number().min(0).max(100, "Máximo 100%"),
  billing_cycle: z.enum(["semanal", "quincenal", "mensual", "personalizado"]),
  active: z.boolean().default(true),
  notes: z.string().optional(),
});

export const orderItemSchema = z.object({
  service_id: z.string().uuid(),
  quantity: z.number().int().min(1, "Mínimo 1"),
  unit_price: z.number().min(0),
});

export const orderSchema = z.object({
  client_id: z.string().uuid().optional(),
  branch_id: z.string().uuid().optional(),
  source: z.enum(["web", "pos", "branch", "manual"]).default("web"),
  items: z.array(orderItemSchema).min(1, "Agrega al menos un servicio"),
  payment_method: z.enum(["efectivo", "transferencia", "yape", "izipay", "pendiente"]),
  delivery_destination: z.enum(["planta", "domicilio", "sucursal"]).default("planta"),
  delivery_address: z.string().optional(),
  delivery_branch_id: z.string().uuid().optional(),
  walk_in_name: z.string().optional(),
  walk_in_phone: z.string().optional(),
  notes: z.string().optional(),
});

export const transactionSchema = z.object({
  type: z.enum(["ingreso", "egreso"]),
  category: z.enum([
    "venta", "liquidacion_sucursal", "gasto_operativo",
    "gasto_movilidad", "gasto_insumos", "otro",
  ]),
  amount: z.number().min(0.01, "Monto requerido"),
  payment_method: z.enum(["efectivo", "transferencia", "yape", "izipay", "pendiente", "otro"]),
  description: z.string().optional(),
});

export const vehicleSchema = z.object({
  plate: z.string().min(1, "Placa requerida"),
  name: z.string().optional(),
  type: z.enum(["recojo", "entrega", "ambos"]),
  driver_name: z.string().optional(),
  driver_phone: z.string().optional(),
  active: z.boolean().default(true),
});

export const promotionSchema = z.object({
  title: z.string().min(2, "Título requerido"),
  description: z.string().optional(),
  discount_percent: z.number().min(0).max(100),
  valid_from: z.string(),
  valid_until: z.string(),
  target_clients: z.array(z.string().uuid()).optional(),
  target_services: z.array(z.string().uuid()).optional(),
});

export const settlementSchema = z.object({
  branch_id: z.string().uuid(),
  period_start: z.string(),
  period_end: z.string(),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Nombre requerido").optional(),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  ruc: z.string().optional(),
});

export const changePasswordSchema = z.object({
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const employeeSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  full_name: z.string().min(2, "Nombre requerido"),
  role: z.enum(["employee", "superadmin"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type BranchInput = z.infer<typeof branchSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type PromotionInput = z.infer<typeof promotionSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
