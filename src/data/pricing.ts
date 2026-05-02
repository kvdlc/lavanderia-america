import type { Service } from "@/types";

export const DEFAULT_SERVICES: Omit<Service, "id" | "created_at" | "updated_at">[] = [
  {
    name: "Lavado de Frazada 1 Plaza",
    slug: "lavado-frazada-1-plaza",
    description: "Lavado industrial profundo con desinfección para frazadas de 1 plaza.",
    long_desc: "Nuestro proceso de lavado industrial garantiza la eliminación completa de bacterias, ácaros y suciedad profunda. Utilizamos detergentes hipoalergénicos de grado industrial y secado a temperatura controlada.",
    base_price: 15.0,
    category: "frazada_1p",
    image_url: null,
    active: true,
    display_order: 1,
  },
  {
    name: "Lavado de Frazada 1.5 Plazas",
    slug: "lavado-frazada-1-5-plazas",
    description: "Lavado industrial profundo con desinfección para frazadas de 1.5 plazas.",
    long_desc: "Tratamiento especializado para frazadas de mayor tamaño. Proceso de lavado con doble enjuague y secado completo para garantizar máxima frescura e higiene.",
    base_price: 20.0,
    category: "frazada_15p",
    image_url: null,
    active: true,
    display_order: 2,
  },
  {
    name: "Lavado de Edredón",
    slug: "lavado-edredon",
    description: "Lavado especializado para edredones con relleno de pluma o fibra sintética.",
    long_desc: "Cuidamos el relleno de tu edredón con un proceso de lavado suave pero efectivo. Secado en condiciones controladas para mantener el volumen y la calidad del relleno.",
    base_price: 25.0,
    category: "edredon",
    image_url: null,
    active: true,
    display_order: 3,
  },
  {
    name: "Lavado de Ropa Industrial",
    slug: "lavado-ropa-industrial",
    description: "Lavado de overoles, uniformes y ropa de trabajo industrial con protocolos certificados.",
    long_desc: "Procesamos grandes volúmenes de ropa industrial con los más altos estándares. Protocolos de sanitización certificados para minería y sector corporativo. Trazabilidad completa por lote.",
    base_price: 12.0,
    category: "ropa_industrial",
    image_url: null,
    active: true,
    display_order: 4,
  },
];

export const ORDER_STATUS_FLOW = [
  "cotizacion",
  "confirmado",
  "recolectado",
  "en_proceso",
  "control_calidad",
  "listo",
  "entregado",
] as const;

export const DEFAULT_DELIVERY_DAYS = 25;

export const AVAILABLE_PERMISSIONS = [
  { slug: "admin:dashboard", description: "Ver dashboard" },
  { slug: "admin:services", description: "Gestionar servicios" },
  { slug: "admin:orders", description: "Gestionar pedidos" },
  { slug: "admin:clients", description: "Ver clientes" },
  { slug: "admin:branches", description: "Gestionar sucursales" },
  { slug: "admin:caja", description: "Caja chica" },
  { slug: "admin:pos", description: "Punto de venta" },
  { slug: "admin:promotions", description: "Gestionar promociones" },
  { slug: "admin:vehicles", description: "Gestionar movilidad" },
  { slug: "admin:deliveries", description: "Gestionar entregas" },
  { slug: "admin:settlements", description: "Liquidar sucursales" },
  { slug: "admin:employees", description: "Gestionar empleados" },
  { slug: "admin:config", description: "Configuración general" },
  { slug: "admin:reports", description: "Reportes" },
  { slug: "admin:client_pricing", description: "Precios por cliente" },
];
