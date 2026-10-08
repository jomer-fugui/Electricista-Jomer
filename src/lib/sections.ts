export type FieldKey =
  | "title"
  | "subtitle"
  | "content"
  | "category"
  | "imageUrl"
  | "gallery"
  | "videoUrl"
  | "linkUrl"
  | "linkLabel"
  | "platform"
  | "price"
  | "unit"
  | "rating"
  | "location"
  | "slug";

export type Layout =
  | "services"
  | "products"
  | "recommend"
  | "bad"
  | "quotes"
  | "colmos"
  | "poems"
  | "links"
  | "songs"
  | "characters"
  | "story"
  | "devlog"
  | "inventions"
  | "prices"
  | "donations"
  | "custom";

export type GroupKey =
  | "servicios"
  | "tienda"
  | "recomendaciones"
  | "truchadas"
  | "frases"
  | "cielinfier"
  | "mas";

export type IconName =
  | "zap"
  | "camera"
  | "globe"
  | "graduation"
  | "store"
  | "cart"
  | "download"
  | "package"
  | "thumbsUp"
  | "award"
  | "link"
  | "alert"
  | "skull"
  | "quote"
  | "laugh"
  | "feather"
  | "music"
  | "swords"
  | "book"
  | "hammer"
  | "lightbulb"
  | "list"
  | "heart"
  | "file"
  | "home"
  | "wrench"
  | "star"
  | "sparkles"
  | "flame"
  | "users"
  | "tag"
  | "ban";

export interface SectionDef {
  key: string;
  path: string;
  group: GroupKey;
  navLabel: string;
  title: string;
  intro: string;
  image?: string;
  layout: Layout;
  icon: IconName;
  itemLabel: string;
  fields: Partial<Record<FieldKey, string>>;
  categories?: string[];
  categoryFree?: boolean;
  detail?: boolean;
  hub?: false;
}

export interface HubDef {
  key: string;
  path: string;
  group: GroupKey;
  navLabel: string;
  allLabel: string;
  title: string;
  intro: string;
  image?: string;
  icon: IconName;
  children: string[];
  hub: true;
}

export type PageDef = SectionDef | HubDef;

export const GROUPS: { key: GroupKey; label: string; icon: IconName }[] = [
  { key: "servicios", label: "Servicios", icon: "wrench" },
  { key: "tienda", label: "Tienda", icon: "store" },
  { key: "recomendaciones", label: "Recomendaciones", icon: "thumbsUp" },
  { key: "truchadas", label: "No recomendable", icon: "alert" },
  { key: "frases", label: "Frases", icon: "quote" },
  { key: "cielinfier", label: "CielInfier", icon: "flame" },
  { key: "mas", label: "Más", icon: "sparkles" },
];

const SERVICE_FIELDS: SectionDef["fields"] = {
  title: "Nombre del servicio",
  subtitle: "Resumen corto",
  content: "Descripción completa",
  imageUrl: "Imagen principal",
  gallery: "Fotos y videos de trabajos realizados",
  videoUrl: "Video (YouTube o archivo)",
  price: "Precio (ej: Desde $ 15.000 / Consultar)",
  unit: "Unidad (ej: por boca, por cámara)",
  linkUrl: "Enlace externo (opcional)",
  linkLabel: "Texto del botón del enlace",
};

const PRODUCT_FIELDS: SectionDef["fields"] = {
  title: "Nombre del producto",
  subtitle: "Detalle corto (medida, modelo, presentación)",
  content: "Descripción",
  category: "Categoría",
  imageUrl: "Imagen del producto",
  gallery: "Más fotos o videos",
  price: "Precio",
  platform: "Plataforma donde se vende",
  linkUrl: "Enlace de compra (Mercado Libre, Hotmart, AliExpress, Amazon…)",
  linkLabel: "Texto del botón (opcional)",
};

const RECOMMEND_FIELDS: SectionDef["fields"] = {
  title: "Nombre",
  subtitle: "Rubro / tipo",
  content: "¿Por qué lo recomiendas?",
  category: "Categoría",
  rating: "Puntuación",
  location: "Ubicación / dirección",
  imageUrl: "Imagen o logo",
  linkUrl: "Enlace (web, Instagram, Google Maps…)",
  linkLabel: "Texto del botón",
};

const BAD_FIELDS: SectionDef["fields"] = {
  title: "Nombre",
  subtitle: "Rubro / tipo",
  content: "¿Qué pasó? Cuenta tu experiencia",
  category: "Categoría",
  rating: "Puntuación (1 = pésimo)",
  location: "Ubicación",
  imageUrl: "Imagen / prueba",
  gallery: "Más pruebas (fotos o videos)",
  linkUrl: "Enlace (opcional)",
};

const PRICE_FIELDS = (what: string): SectionDef["fields"] => ({
  category: "Rubro / grupo",
  title: what,
  subtitle: "Detalle (opcional)",
  unit: "Unidad (ej: por boca, por hora, rollo)",
  price: "Precio",
});

export const FRASES_CATEGORIES = [
  "Ego",
  "Consejos",
  "Reflexión",
  "Negocios",
  "Ideologías lógicas",
  "Ideologías femeninas",
  "Estupidez humana",
  "Frases estúpidas",
  "Religión",
  "Verdad/Mentira",
  "Interés propio",
  "Pobreza/Riqueza",
  "Padres/Hijos",
  "Ser común",
  "Trucos de vida",
  "Política",
];

export const POESIAS_CATEGORIES = [
  "Amor",
  "Canciones de amor",
  "Desamor",
  "Estupidez en el amor",
  "Confusión",
];

export const HUBS: HubDef[] = [
  {
    key: "servicios",
    path: "/Servicios",
    group: "servicios",
    navLabel: "Servicios",
    allLabel: "Todos los servicios",
    title: "Servicios",
    intro:
      "Instalaciones eléctricas, cámaras de seguridad, páginas web y cursos. Trabajo responsable, prolijo y con garantía.",
    image: "/images/electricista.jpg",
    icon: "wrench",
    children: ["electricista", "camaras", "web", "cursos"],
    hub: true,
  },
  {
    key: "tienda",
    path: "/Tienda",
    group: "tienda",
    navLabel: "Tienda",
    allLabel: "Toda la tienda",
    title: "Tienda Jomerarte",
    intro:
      "Materiales eléctricos, productos en Mercado Libre, productos virtuales y artículos que vendo o recomiendo en Hotmart, AliExpress, Amazon y otras plataformas.",
    image: "/images/tienda.jpg",
    icon: "store",
    children: ["tienda-electricidad", "tienda-mercadolibre", "tienda-virtuales", "tienda-otras"],
    hub: true,
  },
  {
    key: "recomendacion",
    path: "/Recomendacion",
    group: "recomendaciones",
    navLabel: "Recomendaciones",
    allLabel: "Todas las recomendaciones",
    title: "Recomendaciones",
    intro:
      "Lugares, marcas, productos, servicios y páginas que recomiendo porque los probé y cumplen lo que prometen.",
    icon: "thumbsUp",
    children: ["rec-negocios", "rec-marcas", "rec-productos", "rec-servicios", "rec-paginas"],
    hub: true,
  },
  {
    key: "truchadas",
    path: "/Truchadas",
    group: "truchadas",
    navLabel: "No recomendable",
    allLabel: "Todo lo NO recomendable",
    title: "NO recomendable",
    intro:
      "Las truchadas: lugares, marcas y servicios que NO recomiendo, basados en experiencias reales. Para que no te pase lo mismo.",
    icon: "alert",
    children: ["truchas-chantas", "truchas-productos", "truchas-servicios"],
    hub: true,
  },
];

export const SECTIONS: SectionDef[] = [
  // ───────────── Servicios
  {
    key: "electricista",
    path: "/Servicios/Electricista",
    group: "servicios",
    navLabel: "Instalaciones Eléctricas",
    title: "Instalaciones Eléctricas",
    intro:
      "Instalaciones nuevas, reparaciones, tableros, iluminación y puesta a tierra. Trabajo seguro, prolijo y garantizado.",
    image: "/images/electricista.jpg",
    layout: "services",
    icon: "zap",
    itemLabel: "servicio",
    fields: SERVICE_FIELDS,
    detail: true,
  },
  {
    key: "camaras",
    path: "/Servicios/Camaras",
    group: "servicios",
    navLabel: "Instalación de Cámaras",
    title: "Instalación de Cámaras",
    intro:
      "Cámaras de seguridad para casas y comercios: kits con grabador, cámaras WiFi, visión nocturna y monitoreo desde el celular.",
    image: "/images/camaras.jpg",
    layout: "services",
    icon: "camera",
    itemLabel: "servicio",
    fields: SERVICE_FIELDS,
    detail: true,
  },
  {
    key: "web",
    path: "/Servicios/Web",
    group: "servicios",
    navLabel: "Creación de Páginas Web",
    title: "Creación de Páginas Web",
    intro:
      "Páginas web modernas, rápidas y adaptadas a celulares para emprendedores, profesionales y comercios.",
    image: "/images/web.jpg",
    layout: "services",
    icon: "globe",
    itemLabel: "servicio",
    fields: SERVICE_FIELDS,
    detail: true,
  },
  {
    key: "cursos",
    path: "/Cursos",
    group: "servicios",
    navLabel: "Cursos",
    title: "Cursos",
    intro:
      "Aprende electricidad, instalación de cámaras y creación de páginas web con cursos prácticos, presenciales u online.",
    image: "/images/cursos.jpg",
    layout: "services",
    icon: "graduation",
    itemLabel: "curso",
    fields: {
      ...SERVICE_FIELDS,
      title: "Nombre del curso",
      platform: "Plataforma (Hotmart, Udemy, propio…)",
      linkUrl: "Enlace de inscripción / compra",
    },
    detail: true,
  },
  // ───────────── Tienda
  {
    key: "tienda-electricidad",
    path: "/Tienda/Electricidad",
    group: "tienda",
    navLabel: "Materiales eléctricos",
    title: "Materiales Eléctricos",
    intro:
      "Cables, térmicas, disyuntores, tomas, iluminación LED y herramientas. Materiales de calidad al mejor precio.",
    image: "/images/tienda.jpg",
    layout: "products",
    icon: "package",
    itemLabel: "producto",
    fields: PRODUCT_FIELDS,
    categories: ["Cables", "Térmicas y disyuntores", "Tomas y llaves", "Iluminación LED", "Herramientas", "Seguridad"],
    categoryFree: true,
    detail: true,
  },
  {
    key: "tienda-mercadolibre",
    path: "/Tienda/MercadoLibre",
    group: "tienda",
    navLabel: "Mercado Libre",
    title: "Mis productos en Mercado Libre",
    intro: "Compra con toda la seguridad de Mercado Libre: envíos a todo el país y pago protegido.",
    layout: "products",
    icon: "cart",
    itemLabel: "producto",
    fields: PRODUCT_FIELDS,
    categoryFree: true,
    detail: true,
  },
  {
    key: "tienda-virtuales",
    path: "/Tienda/Virtuales",
    group: "tienda",
    navLabel: "Productos virtuales",
    title: "Productos Virtuales",
    intro: "Cursos, e-books, plantillas y productos digitales en Hotmart, Gumroad, Udemy y más.",
    layout: "products",
    icon: "download",
    itemLabel: "producto virtual",
    fields: PRODUCT_FIELDS,
    categoryFree: true,
    detail: true,
  },
  {
    key: "tienda-otras",
    path: "/Tienda/Otras",
    group: "tienda",
    navLabel: "AliExpress y otras tiendas",
    title: "AliExpress, Amazon y otras tiendas",
    intro: "Productos que vendo o recomiendo en AliExpress, Amazon, Temu, Shein y cualquier otra plataforma.",
    layout: "products",
    icon: "store",
    itemLabel: "producto",
    fields: PRODUCT_FIELDS,
    categoryFree: true,
    detail: true,
  },
  // ───────────── Recomendaciones
  {
    key: "rec-negocios",
    path: "/Recomendacion/Negocios",
    group: "recomendaciones",
    navLabel: "Los mejores lugares para comprar",
    title: "Los mejores lugares donde comprar",
    intro: "Negocios donde te atienden bien, te asesoran con honestidad y los precios son justos.",
    layout: "recommend",
    icon: "store",
    itemLabel: "negocio",
    fields: RECOMMEND_FIELDS,
    categoryFree: true,
  },
  {
    key: "rec-marcas",
    path: "/Recomendacion/Marcas",
    group: "recomendaciones",
    navLabel: "Las mejores marcas",
    title: "Las mejores marcas",
    intro: "Marcas que uso en mis trabajos y que nunca me fallaron.",
    layout: "recommend",
    icon: "award",
    itemLabel: "marca",
    fields: RECOMMEND_FIELDS,
    categoryFree: true,
  },
  {
    key: "rec-productos",
    path: "/Recomendacion/Productos",
    group: "recomendaciones",
    navLabel: "Productos recomendados",
    title: "Productos recomendados",
    intro: "Herramientas y productos que valen cada peso.",
    layout: "recommend",
    icon: "star",
    itemLabel: "producto",
    fields: { ...RECOMMEND_FIELDS, platform: "Dónde comprarlo", price: "Precio aproximado" },
    categoryFree: true,
  },
  {
    key: "rec-servicios",
    path: "/Recomendacion/Servicios",
    group: "recomendaciones",
    navLabel: "Servicios recomendados",
    title: "Servicios de otros que recomiendo",
    intro: "Profesionales y servicios de confianza que recomiendo sin dudar.",
    layout: "recommend",
    icon: "users",
    itemLabel: "servicio",
    fields: RECOMMEND_FIELDS,
    categoryFree: true,
  },
  {
    key: "rec-paginas",
    path: "/Paginas",
    group: "recomendaciones",
    navLabel: "Las mejores páginas",
    title: "Las mejores páginas",
    intro: "Sitios web, canales y herramientas online que vale la pena visitar.",
    layout: "recommend",
    icon: "globe",
    itemLabel: "página",
    fields: { ...RECOMMEND_FIELDS, location: undefined, linkUrl: "Dirección de la página" },
    categoryFree: true,
  },
  // ───────────── No recomendable
  {
    key: "truchas-chantas",
    path: "/Truchadas/LosChantas",
    group: "truchadas",
    navLabel: "Los Chantas",
    title: "Los peores lugares para comprar",
    intro: "Lugares donde te venden caro, mal o directamente te estafan. Avisados quedan.",
    layout: "bad",
    icon: "skull",
    itemLabel: "lugar",
    fields: BAD_FIELDS,
    categoryFree: true,
  },
  {
    key: "truchas-productos",
    path: "/Truchadas/ProductoTrucho",
    group: "truchadas",
    navLabel: "Producto Trucho",
    title: "Las peores marcas",
    intro: "Marcas y productos truchos que duran menos que un suspiro. No caigas.",
    layout: "bad",
    icon: "ban",
    itemLabel: "marca o producto",
    fields: BAD_FIELDS,
    categoryFree: true,
  },
  {
    key: "truchas-servicios",
    path: "/Truchadas/ServiciosMalos",
    group: "truchadas",
    navLabel: "Servicios Malos",
    title: "Los peores servicios",
    intro: "Servicios que cobran mucho, cumplen poco y te dejan peor de lo que estabas.",
    layout: "bad",
    icon: "alert",
    itemLabel: "servicio",
    fields: BAD_FIELDS,
    categoryFree: true,
  },
  // ───────────── Frases
  {
    key: "frases",
    path: "/Frases",
    group: "frases",
    navLabel: "Frases de un Herje",
    title: "Frases de un Herje",
    intro: "Ego, consejos, reflexiones, negocios, política, verdades incómodas y alguna que otra estupidez.",
    layout: "quotes",
    icon: "quote",
    itemLabel: "frase",
    fields: {
      content: "Frase",
      category: "Categoría",
      title: "Título o autor (opcional)",
      imageUrl: "Imagen (opcional)",
    },
    categories: FRASES_CATEGORIES,
    categoryFree: true,
  },
  {
    key: "colmos",
    path: "/Frases/Colmos",
    group: "frases",
    navLabel: "Colmos",
    title: "Colmos",
    intro: "¿Cuál es el colmo de…? Toca cada tarjeta para ver la respuesta.",
    layout: "colmos",
    icon: "laugh",
    itemLabel: "colmo",
    fields: { title: "Pregunta (¿Cuál es el colmo de…?)", content: "Respuesta" },
  },
  {
    key: "poesias",
    path: "/Frases/Poesias",
    group: "frases",
    navLabel: "Poesías",
    title: "Poesías",
    intro: "Amor, canciones de amor, desamor, estupidez en el amor y confusión.",
    layout: "poems",
    icon: "feather",
    itemLabel: "poesía",
    fields: {
      title: "Título",
      category: "Categoría",
      content: "Poesía (respeta los saltos de línea)",
      imageUrl: "Imagen (opcional)",
      videoUrl: "Video o audio (opcional)",
    },
    categories: POESIAS_CATEGORIES,
    categoryFree: true,
  },
  // ───────────── CielInfier
  {
    key: "cielinfier-personajes",
    path: "/Cielinfier",
    group: "cielinfier",
    navLabel: "Personajes",
    title: "CielInfier · Personajes",
    intro:
      "El anime / videojuego que estoy creando. Conoce a los personajes del Cielo, del Infierno y de los que quedaron en medio.",
    image: "/images/cielinfier.jpg",
    layout: "characters",
    icon: "swords",
    itemLabel: "personaje",
    fields: {
      title: "Nombre",
      subtitle: "Rol / raza / poder",
      category: "Bando",
      content: "Historia y personalidad",
      imageUrl: "Imagen principal",
      gallery: "Galería (bocetos, fotos y videos)",
      videoUrl: "Video destacado",
    },
    categories: ["Cielo", "Infierno", "Tierra", "Neutral"],
    categoryFree: true,
    detail: true,
  },
  {
    key: "cielinfier-historia",
    path: "/Cielinfier/historia",
    group: "cielinfier",
    navLabel: "Historia",
    title: "CielInfier · Historia",
    intro: "La historia de CielInfier, capítulo a capítulo.",
    image: "/images/cielinfier.jpg",
    layout: "story",
    icon: "book",
    itemLabel: "capítulo",
    fields: {
      subtitle: "Capítulo (ej: Capítulo 1)",
      title: "Título",
      content: "Texto de la historia",
      imageUrl: "Imagen",
      gallery: "Galería",
      videoUrl: "Video",
    },
    detail: true,
  },
  {
    key: "cielinfier-proceso",
    path: "/Cielinfier/proceso",
    group: "cielinfier",
    navLabel: "Proceso del proyecto",
    title: "CielInfier · Proceso del proyecto",
    intro: "Bocetos, pruebas, animaciones y avances del desarrollo del anime / videojuego.",
    image: "/images/cielinfier.jpg",
    layout: "devlog",
    icon: "hammer",
    itemLabel: "avance",
    fields: {
      title: "Título del avance",
      subtitle: "Fecha o etapa",
      category: "Área",
      content: "Descripción",
      imageUrl: "Imagen principal",
      gallery: "Galería (fotos y videos)",
      videoUrl: "Video",
    },
    categories: ["Guion", "Arte", "Animación", "Programación", "Música"],
    categoryFree: true,
    detail: true,
  },
  // ───────────── Más
  {
    key: "mis-paginas",
    path: "/MisPaginas",
    group: "mas",
    navLabel: "Mis páginas",
    title: "Mis páginas",
    intro: "Otras páginas, canales y redes donde publico mi trabajo.",
    layout: "links",
    icon: "link",
    itemLabel: "página",
    fields: {
      title: "Nombre",
      subtitle: "Descripción corta",
      content: "Descripción",
      imageUrl: "Imagen / captura",
      platform: "Tipo / plataforma",
      linkUrl: "Enlace",
      linkLabel: "Texto del botón",
    },
  },
  {
    key: "canciones",
    path: "/CancionesJomer",
    group: "mas",
    navLabel: "Mis canciones",
    title: "Canciones de Jomer",
    intro: "Letras, audios y videos de mis canciones.",
    layout: "songs",
    icon: "music",
    itemLabel: "canción",
    fields: {
      title: "Título",
      subtitle: "Género / año",
      content: "Letra",
      imageUrl: "Portada",
      videoUrl: "Video (YouTube) o audio (MP3)",
      platform: "Plataforma",
      linkUrl: "Escuchar en (Spotify, YouTube…)",
    },
    detail: true,
  },
  {
    key: "inventos",
    path: "/inventos",
    group: "mas",
    navLabel: "Inventos",
    title: "Mis Inventos",
    intro: "Fotos y videos de mis inventos, prototipos e ideas locas que terminaron funcionando.",
    image: "/images/inventos.jpg",
    layout: "inventions",
    icon: "lightbulb",
    itemLabel: "invento",
    fields: {
      title: "Nombre del invento",
      subtitle: "Resumen",
      category: "Estado",
      content: "Descripción / cómo funciona",
      imageUrl: "Imagen principal",
      gallery: "Galería (fotos y videos)",
      videoUrl: "Video destacado",
      linkUrl: "Enlace (opcional)",
    },
    categories: ["Idea", "Prototipo", "En desarrollo", "Terminado"],
    categoryFree: true,
    detail: true,
  },
  {
    key: "precios-servicios",
    path: "/PreciosServicios",
    group: "mas",
    navLabel: "Precios de servicios",
    title: "Lista de precios de Servicios",
    intro: "Precios de referencia de mis servicios. Pide tu presupuesto sin compromiso.",
    layout: "prices",
    icon: "list",
    itemLabel: "precio",
    fields: PRICE_FIELDS("Servicio"),
    categoryFree: true,
  },
  {
    key: "precios-productos",
    path: "/PreciosProductos",
    group: "mas",
    navLabel: "Precios de productos",
    title: "Lista de precios de Productos",
    intro: "Precios de referencia de los productos y materiales que vendo.",
    layout: "prices",
    icon: "tag",
    itemLabel: "precio",
    fields: PRICE_FIELDS("Producto"),
    categoryFree: true,
  },
  {
    key: "donacion",
    path: "/Donacion",
    group: "mas",
    navLabel: "Donaciones",
    title: "Apoya mis proyectos",
    intro:
      "Si te gusta lo que hago (CielInfier, inventos, frases, canciones…) puedes ayudarme con una donación. ¡Cualquier aporte suma y se agradece de corazón!",
    layout: "donations",
    icon: "heart",
    itemLabel: "medio de donación",
    fields: {
      title: "Medio (Mercado Pago, PayPal, Cafecito…)",
      subtitle: "Alias / CBU / usuario (se puede copiar)",
      content: "Instrucciones",
      imageUrl: "Código QR o imagen",
      platform: "Plataforma",
      linkUrl: "Enlace de pago",
      linkLabel: "Texto del botón",
    },
  },
  {
    key: "custom",
    path: "/__custom",
    group: "mas",
    navLabel: "Páginas personalizadas",
    title: "Páginas personalizadas",
    intro: "Crea páginas nuevas con la dirección que quieras (por ejemplo jomerarte.com/Contacto).",
    layout: "custom",
    icon: "file",
    itemLabel: "página",
    fields: {
      title: "Título de la página",
      slug: "Dirección (ej: Contacto → jomerarte.com/Contacto)",
      subtitle: "Subtítulo",
      content: "Contenido",
      imageUrl: "Imagen principal",
      gallery: "Galería (fotos y videos)",
      videoUrl: "Video",
      linkUrl: "Enlace del botón (opcional)",
      linkLabel: "Texto del botón",
    },
  },
];

export const ALL_PAGE_DEFS: PageDef[] = [...HUBS, ...SECTIONS];

export function getSection(key: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.key === key);
}

export function getHub(key: string): HubDef | undefined {
  return HUBS.find((h) => h.key === key);
}

export function getPageDef(key: string): PageDef | undefined {
  return ALL_PAGE_DEFS.find((p) => p.key === key);
}

const SUBNAV_GROUPS: string[][] = [
  ["frases", "colmos", "poesias"],
  ["cielinfier-personajes", "cielinfier-historia", "cielinfier-proceso"],
  ["precios-servicios", "precios-productos"],
];

/** Pestañas relacionadas con una página (hermanos dentro de su grupo) */
export function subnavFor(key: string): string[] | null {
  for (const hub of HUBS) {
    if (hub.key === key || hub.children.includes(key)) return [hub.key, ...hub.children];
  }
  for (const group of SUBNAV_GROUPS) if (group.includes(key)) return group;
  return null;
}

export function normalizePath(p: string): string {
  let s = p;
  try {
    s = decodeURIComponent(s);
  } catch {
    // ignore malformed URI
  }
  const out = s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\/+$/, "");
  return out || "/";
}

const ALIASES: Record<string, string> = {
  "/tienda/elecricidad": "/Tienda/Electricidad",
  "/tienda/materiales": "/Tienda/Electricidad",
  "/tienda/aliexpress": "/Tienda/Otras",
  "/tienda/otros": "/Tienda/Otras",
  "/servicios/cursos": "/Cursos",
  "/servicios/electricidad": "/Servicios/Electricista",
  "/recomendaciones": "/Recomendacion",
  "/recomendacion/paginas": "/Paginas",
  "/recomendacion/lugares": "/Recomendacion/Negocios",
  "/norecomendable": "/Truchadas",
  "/truchadas/chantas": "/Truchadas/LosChantas",
  "/cielinfier/personajes": "/Cielinfier",
  "/frases/poesia": "/Frases/Poesias",
  "/poesias": "/Frases/Poesias",
  "/colmos": "/Frases/Colmos",
  "/canciones": "/CancionesJomer",
  "/donaciones": "/Donacion",
  "/donar": "/Donacion",
  "/precios": "/PreciosServicios",
};

export type Resolved =
  | { kind: "hub"; hub: HubDef; canonical: string }
  | { kind: "section"; section: SectionDef; canonical: string }
  | { kind: "detail"; section: SectionDef; id: number; canonical: string };

function matchPage(norm: string): PageDef | undefined {
  const target = ALIASES[norm] ? normalizePath(ALIASES[norm]) : norm;
  return ALL_PAGE_DEFS.find((p) => p.key !== "custom" && normalizePath(p.path) === target);
}

/** Resuelve una URL (sin importar mayúsculas o acentos) a una página del sitio */
export function resolvePath(rawPath: string): Resolved | null {
  const norm = normalizePath(rawPath);
  const page = matchPage(norm);
  if (page) {
    return page.hub
      ? { kind: "hub", hub: page, canonical: page.path }
      : { kind: "section", section: page, canonical: page.path };
  }
  const m = norm.match(/^(.*)\/(\d+)(?:-[^/]*)?$/);
  if (m) {
    const base = matchPage(m[1] || "/");
    if (base && !base.hub && base.detail) {
      return { kind: "detail", section: base, id: Number(m[2]), canonical: base.path };
    }
  }
  return null;
}

export function pathOf(key: string): string {
  return getPageDef(key)?.path ?? "/";
}

const FEMININE = new Set(["frase", "poesía", "canción", "página", "marca", "marca o producto"]);

/** “Nueva frase”, “Nuevo producto”… */
export function newItemLabel(section: Pick<SectionDef, "itemLabel">): string {
  return `${FEMININE.has(section.itemLabel) ? "Nueva" : "Nuevo"} ${section.itemLabel}`;
}
