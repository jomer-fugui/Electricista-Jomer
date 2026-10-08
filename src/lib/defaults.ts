export const DEFAULT_SETTINGS = {
  siteName: "Jomerarte",
  tagline: "Electricidad · Cámaras · Páginas Web · Cursos · Arte",
  accentColor: "#b3121f",
  logoUrl: "",
  logoLightUrl: "",
  footerText:
    "Electricidad, seguridad, tecnología, inventos y arte. Hecho con pasión por Jomer Works.",
  heroTitle: "Energía, seguridad y creatividad con sello propio",
  heroText:
    "Soy Jomer: electricista, instalador de cámaras, creador de páginas web, inventor y artista. Aquí encontrarás mis servicios, mi tienda, mis frases, mis inventos y el universo de CielInfier.",
  heroImage: "/images/hero.jpg",
  aboutTitle: "¿Quién es Jomer?",
  aboutText:
    "Trabajo con la electricidad desde hace años y me apasiona crear: instalaciones seguras, sistemas de cámaras, páginas web, inventos, canciones, poesías y hasta un anime / videojuego propio.\n\nCada trabajo lo hago con responsabilidad, prolijidad y honestidad. Si necesitas algo, escríbeme y lo vemos juntos.",
  aboutImage: "",
  whatsapp: "",
  whatsappMessage: "Hola Jomer, vi tu página Jomerarte y quiero consultar por",
  phone: "",
  email: "contacto@jomerarte.com",
  address: "",
  hours: "Lunes a sábado de 8 a 20 hs",
  instagram: "",
  facebook: "",
  youtube: "",
  tiktok: "",
  twitter: "",
  storeMercadoLibre: "",
  storeHotmart: "",
  storeAliExpress: "",
  storeAmazon: "",
  storeOther: "",
  storeOtherLabel: "",
  pricesNote:
    "Los precios son de referencia y pueden variar según el trabajo, los materiales y la distancia. Consulta sin compromiso.",
};

export type Settings = typeof DEFAULT_SETTINGS;
export type SettingKey = keyof Settings;

export type SettingField = {
  key: SettingKey;
  label: string;
  type: "text" | "textarea" | "color" | "image" | "url" | "email" | "tel";
  hint?: string;
};

export const SETTINGS_GROUPS: { title: string; description?: string; fields: SettingField[] }[] = [
  {
    title: "Identidad y logo",
    description: "Nombre, eslogan, logo y color principal del sitio.",
    fields: [
      { key: "siteName", label: "Nombre del sitio", type: "text" },
      { key: "tagline", label: "Eslogan", type: "text" },
      {
        key: "logoUrl",
        label: "Logo principal (para fondo oscuro)",
        type: "image",
        hint: "Sube aquí tu logo (PNG con fondo transparente ideal). Si lo dejas vacío se usa el logo dibujado por defecto.",
      },
      {
        key: "logoLightUrl",
        label: "Logo con fondo blanco (versión clara)",
        type: "image",
        hint: "Se muestra dentro de un círculo blanco en la portada, el pie de página y “Sobre mí”. Si solo tienes la versión con fondo blanco, súbela aquí.",
      },
      { key: "accentColor", label: "Color principal", type: "color", hint: "El rojo del logo por defecto: #b3121f" },
      { key: "footerText", label: "Texto del pie de página", type: "textarea" },
    ],
  },
  {
    title: "Portada (Inicio)",
    fields: [
      { key: "heroTitle", label: "Título principal", type: "text" },
      { key: "heroText", label: "Texto de bienvenida", type: "textarea" },
      { key: "heroImage", label: "Imagen de fondo de la portada", type: "image" },
      { key: "aboutTitle", label: "Título de la sección “Sobre mí”", type: "text" },
      { key: "aboutText", label: "Texto “Sobre mí”", type: "textarea" },
      { key: "aboutImage", label: "Foto “Sobre mí” (opcional)", type: "image" },
    ],
  },
  {
    title: "Contacto",
    fields: [
      {
        key: "whatsapp",
        label: "WhatsApp",
        type: "tel",
        hint: "Con código de país, solo números. Ej: 5491122334455. Activa los botones de WhatsApp en todo el sitio.",
      },
      { key: "whatsappMessage", label: "Mensaje inicial de WhatsApp", type: "text" },
      { key: "phone", label: "Teléfono", type: "tel" },
      { key: "email", label: "Email", type: "email" },
      { key: "address", label: "Zona / dirección", type: "text" },
      { key: "hours", label: "Horario de atención", type: "text" },
    ],
  },
  {
    title: "Redes sociales",
    fields: [
      { key: "instagram", label: "Instagram (enlace)", type: "url" },
      { key: "facebook", label: "Facebook (enlace)", type: "url" },
      { key: "youtube", label: "YouTube (enlace)", type: "url" },
      { key: "tiktok", label: "TikTok (enlace)", type: "url" },
      { key: "twitter", label: "X / Twitter (enlace)", type: "url" },
    ],
  },
  {
    title: "Tiendas externas",
    description: "Enlaces a tus perfiles o tiendas. Aparecen como botones en la página Tienda.",
    fields: [
      { key: "storeMercadoLibre", label: "Mi tienda en Mercado Libre", type: "url" },
      { key: "storeHotmart", label: "Mi perfil en Hotmart", type: "url" },
      { key: "storeAliExpress", label: "Mi tienda / lista en AliExpress", type: "url" },
      { key: "storeAmazon", label: "Mi tienda / lista en Amazon", type: "url" },
      { key: "storeOther", label: "Otra tienda (enlace)", type: "url" },
      { key: "storeOtherLabel", label: "Nombre de la otra tienda", type: "text" },
    ],
  },
  {
    title: "Listas de precios",
    fields: [{ key: "pricesNote", label: "Nota al pie de las listas de precios", type: "textarea" }],
  },
];
