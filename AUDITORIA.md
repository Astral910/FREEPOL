# AUDITORÍA TÉCNICA COMPLETA — FREEPOL
**Fecha de registro:** 20 de marzo de 2026  
**Repositorio:** https://github.com/Astral910/FREEPOL  
**Rama activa:** `develop`  
**Estado general:** En desarrollo activo — Fase 1 completada, Fase 2 en progreso

---

## 1. ¿QUÉ ES FREEPOL?

FREEPOL es una plataforma **SaaS B2B** diseñada para empresas medianas y grandes de América Latina (restaurantes, retail, gasolineras, cadenas de comida rápida). Permite a un empresario **crear campañas de fidelización sin escribir una sola línea de código**.

El flujo central es:
1. El empresario describe su campaña en lenguaje natural (español o inglés)
2. La IA (Claude de Anthropic) analiza el prompt y extrae una configuración estructurada en JSON
3. Se muestra qué puede hacer FREEPOL y qué ajustes hizo
4. Un wizard de 10 pasos (por construir) se pre-llena con esa configuración
5. El empresario confirma y la campaña se despliega automáticamente en WhatsApp, Telegram e Instagram

---

## 2. STACK TECNOLÓGICO COMPLETO

### Frontend
| Tecnología | Versión | Para qué se usa |
|---|---|---|
| **Next.js 14** | 14.2.29 | Framework principal con App Router. Maneja rutas, SSR, API Routes y optimización de imágenes. |
| **React 18** | 18.3.1 | Base de la UI. Se usa con Server y Client Components. |
| **TypeScript** | 5.9.3 | Tipado estricto en todo el proyecto. Nunca se usa `any`. |
| **Tailwind CSS** | 3.4.19 | Todos los estilos. Mobile-first, utility-first. |
| **Framer Motion** | 12.38.0 | Todas las animaciones: fadeIn, slideUp, stagger, hover effects, AnimatePresence. |
| **Lucide React** | 0.577.0 | Íconos: Zap, Sparkles, ArrowRight, Menu, Check, Trophy, Star, etc. |

### UI Components (shadcn/ui — instalados manualmente sobre Radix UI)
| Componente | Radix Primitivo | Para qué se usa |
|---|---|---|
| **Button** | `@radix-ui/react-slot` | Botón base con variantes: default, outline, ghost, link |
| **Dialog** | `@radix-ui/react-dialog` | Modal de autenticación (login/registro). Modificado para tener scroll cuando el contenido supera la pantalla |
| **Tabs** | `@radix-ui/react-tabs` | Panel de prompts en landing, tabs de industria en TipsPanel, tabs login/registro en AuthDialog |
| **Separator** | `@radix-ui/react-separator` | Líneas divisoras en sidebar móvil y footer |
| **Label** | `@radix-ui/react-label` | Labels de formularios con accesibilidad |
| **Sheet** | `@radix-ui/react-dialog` | Menú lateral móvil del Navbar y panel de Tips del chat |
| **Badge** | (custom CVA) | Badges de sección con variantes de color |
| **Input** | (custom HTML) | Inputs de formularios con focus ring en #5B5CF6 |

### Utilidades CSS/JS
| Tecnología | Para qué se usa |
|---|---|
| **class-variance-authority (CVA)** | Variantes de componentes UI (Button, Badge) |
| **clsx + tailwind-merge** | Combinar clases de Tailwind sin conflictos |
| **tailwindcss-animate** | Animaciones CSS para los componentes Radix (data-state=open/closed) |

### Backend / API
| Tecnología | Versión | Para qué se usa |
|---|---|---|
| **@anthropic-ai/sdk** | 0.80.0 | SDK oficial de Anthropic para llamar a Claude desde el servidor |
| **Claude claude-sonnet-4-20250514** | — | Modelo de IA que analiza los prompts y devuelve JSON estructurado. 2000 max tokens. |
| **Next.js API Routes** | — | `POST /api/analizar-prompt` — endpoint del servidor que recibe el prompt y llama a Claude |

### Autenticación
| Tecnología | Versión | Para qué se usa |
|---|---|---|
| **@supabase/supabase-js** | 2.99.3 | SDK de Supabase para auth (login, signup, signOut) |
| **@supabase/ssr** | 0.9.0 | Versión SSR de Supabase para Next.js App Router. Usa `createBrowserClient()` en componentes cliente |

### Formularios
| Tecnología | Versión | Para qué se usa |
|---|---|---|
| **react-hook-form** | 7.71.2 | Formulario de registro con validaciones (mínimo de chars, formato email, coincidencia de contraseñas) |
| **react-textarea-autosize** | 8.5.9 | Textarea del chat que crece automáticamente de 1 a 6 filas según el contenido |
| **react-hot-toast** | 2.6.0 | Notificaciones elegantes (errores del chat, confirmaciones) con tema oscuro personalizado |

### Identidad / IDs
| Tecnología | Versión | Para qué se usa |
|---|---|---|
| **uuid (v4)** | 13.0.0 | Genera IDs únicos para cada mensaje del chat (`uuidv4()`) |

### Fuente tipográfica
| Tecnología | Para qué se usa |
|---|---|
| **Inter (Google Fonts)** | Fuente principal del proyecto. Cargada con `next/font/google` para optimización automática. Variable CSS: `--font-inter` |

---

## 3. PALETA DE COLORES (FIJA — nunca cambiar)

| Nombre | Hex | Uso |
|---|---|---|
| Primario | `#5B5CF6` | Botones principales, links activos, acentos de UI |
| Secundario | `#22C55E` | Éxito, checks verdes, badges de confirmación |
| Fondo principal | `#FFFFFF` | Landing page |
| Cards | `#F8FAFC` | Fondos de cards en landing |
| Bordes | `#E5E7EB` | Bordes de cards, separadores en landing |
| Texto principal | `#0F172A` | Texto oscuro en landing |
| Texto suave | `#64748B` | Subtítulos, placeholders en landing |
| Gradiente IA | `#5B5CF6 → #A855F7` | Clase `.gradient-text` y `.gradient-bg` |
| **Chat — Fondo** | `#0F172A` | Fondo de la página /chat (tema oscuro) |
| **Chat — Superficie** | `#1E293B` | Cards, burbujas de IA, input box |
| **Chat — Bordes** | `#334155` | Bordes en tema oscuro |
| **Chat — Texto** | `#E2E8F0` | Texto principal en tema oscuro |
| **Chat — Suave** | `#94A3B8` | Subtítulos en tema oscuro |

---

## 4. ESTRUCTURA DE ARCHIVOS ACTUAL

```
FREEPOL/
├── app/
│   ├── globals.css              ← Variables CSS, animaciones, .gradient-text/.gradient-bg
│   ├── layout.tsx               ← Layout raíz: fuente Inter, metadatos SEO, Open Graph
│   ├── page.tsx                 ← Landing page (/) — ensambla todos los componentes
│   ├── chat/
│   │   └── page.tsx             ← Página /chat — interfaz de IA completa
│   └── api/
│       └── analizar-prompt/
│           └── route.ts         ← POST /api/analizar-prompt — llama a Claude
│
├── components/
│   ├── Navbar.tsx               ← Navbar fijo con scroll, móvil, link a /chat
│   ├── AuthDialog.tsx           ← Modal login/registro con Supabase
│   ├── HeroSection.tsx          ← Sección hero de la landing
│   ├── ChatMockup.tsx           ← Mockup visual del chat en el hero
│   ├── LogosBar.tsx             ← Barra de logos de marcas
│   ├── PilaresSection.tsx       ← Los 3 pilares de FREEPOL
│   ├── PasosSection.tsx         ← Los 4 pasos del proceso
│   ├── CasosSection.tsx         ← 3 casos de uso reales
│   ├── IAPanel.tsx              ← Panel de guía de prompts (landing)
│   ├── CTAFinal.tsx             ← CTA final con gradiente, link a /chat
│   ├── Footer.tsx               ← Footer oscuro con 4 columnas
│   │
│   ├── chat/
│   │   ├── ChatArea.tsx         ← Área principal del chat (estados: idle/loading/results)
│   │   ├── ChatInput.tsx        ← Input con TextareaAutosize y botón enviar
│   │   ├── ResultadosAnalisis.tsx ← Pantalla de resultados del análisis de IA
│   │   └── TipsPanel.tsx        ← Panel lateral de guía de prompts (Sheet)
│   │
│   └── ui/
│       ├── button.tsx           ← Button (CVA + Radix Slot)
│       ├── dialog.tsx           ← Dialog con overlay scrollable
│       ├── tabs.tsx             ← Tabs (Radix)
│       ├── separator.tsx        ← Separator (Radix)
│       ├── label.tsx            ← Label (Radix)
│       ├── input.tsx            ← Input HTML con focus ring
│       ├── badge.tsx            ← Badge con variantes de color
│       ├── sheet.tsx            ← Sheet (panel lateral, Radix Dialog)
│       ├── GradientBadge.tsx    ← Badge reutilizable (purple/green/blue)
│       └── AnimatedCounter.tsx  ← Contador animado con Framer Motion spring
│
├── lib/
│   ├── claude.ts                ← Cliente Claude: analizarPromptEmpresario() + retry + timeout
│   ├── supabase.ts              ← createClient() para componentes cliente
│   ├── utils.ts                 ← cn() — combina clases Tailwind
│   └── hooks/
│       └── useScrollAnimation.ts ← Hook: useInView + variants fadeUp/fadeIn/stagger
│
├── types/
│   └── campana.ts               ← Todos los tipos: EstadoChat, TipoCampana, Canal,
│                                    ConfigCampana, ResultadoAnalisis, MensajeChat
│
├── .env.local                   ← Variables de entorno (NO está en git)
├── .gitignore
├── next.config.js               ← Permite imágenes de Unsplash
├── tailwind.config.ts           ← Colores, animaciones, fuente Inter
├── tsconfig.json                ← TypeScript strict mode
├── postcss.config.js
└── .eslintrc.json
```

---

## 5. VARIABLES DE ENTORNO (.env.local)

```env
# Supabase — autenticación de usuarios
NEXT_PUBLIC_SUPABASE_URL=https://dcvugiqcjdfuhxiyqvue.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_uzZ2sXXm47ItPrCmBBcPhQ_WeGjU2nn
SUPABASE_SERVICE_ROLE_KEY=postgresql://postgres:[PASSWORD]@db.dcvugiqcjdfuhxiyqvue.supabase.co:5432/postgres

# Claude (Anthropic) — motor de IA
ANTHROPIC_API_KEY=tu_api_key_aqui  ← PENDIENTE CONFIGURAR
```

---

## 6. RUTAS DISPONIBLES

| Ruta | Tipo | Estado | Descripción |
|---|---|---|---|
| `/` | Static | ✅ Funcional | Landing page completa |
| `/chat` | Static | ✅ Funcional | Interfaz de chat con IA |
| `/api/analizar-prompt` | Dynamic (Server) | ✅ Funcional | Recibe prompt, llama a Claude, devuelve JSON |
| `/dashboard` | — | ❌ No existe | Redirección post-login (pendiente) |

---

## 7. LO QUE SE HA COMPLETADO

### FASE 1 — Landing Page (100% completa)

#### Navbar (`components/Navbar.tsx`)
- Fijo en `top-0` con `z-50`
- **Comportamiento de scroll:** transparente en reposo → `bg-white/95 backdrop-blur-md border-b` al pasar 20px de scroll (detectado con `useEffect` + `window.addEventListener`)
- **Desktop:** logo FREEPOL (FREE en #5B5CF6 + POL en #0F172A + ícono Zap), 4 links de nav, botón ghost "Probar IA →" (navega a `/chat`), botón ghost "Iniciar sesión" (abre AuthDialog), botón "Empezar gratis" (abre AuthDialog)
- **Móvil:** botón hamburguesa (ícono `Menu`) que abre un `Sheet` desde la derecha con ancho 280px. Mismo contenido que desktop más botón "Probar IA →"
- **Transición:** 300ms en todos los cambios de estilo

#### AuthDialog (`components/AuthDialog.tsx`)
- Modal `Dialog` de Radix UI, carga con `dynamic import` + `ssr: false` para no bloquear el bundle
- **Tab Login:** email + password (con toggle ojo `Eye/EyeOff`), checkbox "Recordarme", link "¿Olvidaste tu contraseña?", botón Google con SVG multicolor, spinner `Loader2` durante carga
- **Tab Registro:** 5 campos (`react-hook-form`), indicador de fortaleza de contraseña (4 requisitos con check verde al cumplirse), checkbox de términos
- **Supabase Auth:** `signInWithPassword()` en login → redirige a `/dashboard`. `signUp()` en registro → muestra pantalla de confirmación con ícono `Mail` animado + countdown de 60s para reenvío
- **Fix de scroll:** El overlay del Dialog tiene `overflow-y-auto` con flex centering para que formularios largos sean accesibles en pantallas pequeñas

#### HeroSection (`components/HeroSection.tsx`) + ChatMockup (`components/ChatMockup.tsx`)
- Badge animado con punto parpadeante (`animate-pulse-dot`) + Framer Motion fadeIn desde arriba
- Título `text-5xl md:text-7xl` con primera línea en `#0F172A` y segunda con clase `.gradient-text` (#5B5CF6 → #A855F7)
- Subtítulo `max-w-2xl text-lg md:text-xl text-[#64748B]`
- Botón CTA principal → navega a `/chat`; botón secundario → scroll suave a `#casos`
- Nota de confianza: "✓ Sin tarjeta de crédito · ✓ Listo en 5 minutos · ✓ Cancela cuando quieras"
- **ChatMockup:** ventana de navegador simulada con 3 puntos de colores, URL `app.freepol.com/chat`, fondo `#0F172A`, 2 burbujas de mensaje + respuesta de IA, input falso con ícono `Send`. Perspectiva CSS 3D: `perspective(1200px) rotateX(3deg)`
- Fondos decorativos: 2 círculos difusos con `blur-3xl`, patrón de puntos SVG (`dot-pattern`)

#### LogosBar (`components/LogosBar.tsx`)
- Fondo `#F8FAFC`, borde arriba/abajo `#E5E7EB`
- 5 marcas: "Pollo Campero", "Walmart", "McDonald's", "Grupo Puma", "Claro"
- Texto `#CBD5E1` hover `#94A3B8` — efecto de logos en escala de grises
- Se anima con `useInView` de Framer Motion (solo una vez)

#### PilaresSection (`components/PilaresSection.tsx`)
- 3 cards en grid `grid-cols-1 md:grid-cols-3`
- Cada card: borde izquierdo de 4px con color distintivo, ícono en fondo de color claro, badge al pie
  - Card 1 — Motor de IA: `MessageSquare` en #5B5CF6, borde `border-l-[#5B5CF6]`
  - Card 2 — Omnicanal: `Zap` en #22C55E, borde `border-l-[#22C55E]`
  - Card 3 — Datos: `BarChart3` en #A855F7, borde `border-l-[#A855F7]`
- Animación stagger: cada card entra con 100ms de diferencia

#### PasosSection (`components/PasosSection.tsx`)
- 4 pasos en grid `grid-cols-2 md:grid-cols-4`
- Número grande en `.gradient-text` (`text-5xl font-black`)
- Línea conectora punteada horizontal solo en desktop (`border-t-2 border-dashed`)
- Íconos: `PenLine`, `Brain`, `Settings2`, `Rocket`
- Animación stagger con `useInView`

#### CasosSection (`components/CasosSection.tsx`)
- id `"casos"` para el scroll desde el hero
- 3 cards grandes con borde superior de color de marca:
  - **Pollo Campero:** `#E8000D`, ícono `Trophy`, badge rojo, número decorativo `01` en fondo difuso
  - **Walmart + Puma:** `#0071CE`, ícono `Star`, badge azul
  - **McDonald's:** `#FFC72C`, ícono `Ticket`, badge amarillo
- Animación alternada: cards entran desde la izquierda y derecha alternando (`x: -30 / +30`)

#### IAPanel (`components/IAPanel.tsx`)
- 2 columnas en desktop: izquierda sticky con descripción, derecha con tabs interactivos
- 4 tabs con prompts de ejemplo en estilo terminal (fondo `#0F172A`, texto verde `#22C55E`, fuente mono)
- Tabs: Restaurante (`UtensilsCrossed`), Retail (`ShoppingBag`), Gasolinera (`Fuel`), E-commerce (`Globe`)
- Badge de validación verde en cada tab

#### CTAFinal (`components/CTAFinal.tsx`)
- Fondo con `.gradient-bg` (#5B5CF6 → #A855F7), `py-32`
- Elementos decorativos: 2 círculos difusos blancos semitransparentes en esquinas
- Botón "Crear cuenta gratis" → navega a `/chat`
- Botón "Ver una demo" en outline blanco

#### Footer (`components/Footer.tsx`)
- Fondo `#0F172A`, grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Columna Brand: logo FREEPOL blanco, descripción, íconos sociales `Twitter`, `Linkedin`, `Instagram`
- 3 columnas de links: Producto (5 links), Recursos (5 links), Legal (4 links)
- Copyright + "Hecho con ❤️ para empresas de Latinoamérica"

#### Componentes UI reutilizables
- **`GradientBadge`**: badge de sección con 3 variantes (purple/green/blue)
- **`AnimatedCounter`**: anima un número del 0 al valor final con `useSpring` de Framer Motion + `Intl.NumberFormat`
- **`useScrollAnimation` hook**: encapsula `useInView` con `once: true` y devuelve variants pre-definidos

---

### FASE 2 — Módulo de IA / Chat (80% completo)

#### Tipos TypeScript (`types/campana.ts`)
Interfaces completas:
- `EstadoChat`: `'idle' | 'typing' | 'loading' | 'results' | 'wizard'`
- `TipoCampana`: `'ruleta' | 'puntos' | 'cupon' | 'factura'`
- `Canal`: `'whatsapp' | 'telegram' | 'instagram' | 'landing' | 'todos'`
- `Condicion`: `'correo' | 'telefono' | 'quiz' | 'libre'`
- `Frecuencia`: `'1_total' | '1_dia' | '1_semana' | 'sin_limite'`
- `Premio`: `{ nombre: string, probabilidad: number }`
- `AlternativaItem`: `{ pidio, razon, alternativa }`
- `ConfigCampana`: 18 campos de configuración de campaña
- `ResultadoAnalisis`: `{ puede_hacer[], no_puede_hacer[], alternativas[], config }`
- `MensajeChat`: `{ id, rol, contenido, timestamp }`
- Mapas de etiquetas: `TIPO_CAMPANA_LABEL`, `CANAL_LABEL`, `FRECUENCIA_LABEL`

#### Claude API Client (`lib/claude.ts`)
- Función `analizarPromptEmpresario(prompt)`:
  - Usa `claude-sonnet-4-20250514` con `max_tokens: 2000`
  - System prompt detallado con capacidades y limitaciones de FREEPOL
  - Limpieza automática de markdown (` ```json `) antes de parsear
  - **Retry automático:** si falla el parseo del JSON, espera 1 segundo y reintenta con prompt más explícito
  - **Timeout:** 30 segundos con `Promise.race()`
  - Log en consola del tiempo de análisis
- Función `generarMensajeBienvenida(config)`: genera mensaje personalizado según tipo de campaña

#### API Route (`app/api/analizar-prompt/route.ts`)
- `POST /api/analizar-prompt`
- **Validaciones:** prompt requerido, mínimo 20 chars, máximo 1000 chars
- **Rate limiting en memoria:** `Map<IP, timestamp[]>`, ventana deslizante de 1 minuto, máximo 5 requests por IP. Responde `429` si se supera.
- Llama a `analizarPromptEmpresario()` de `lib/claude.ts`
- Responde `400` (validación), `429` (rate limit), `500` (error Claude), `200` (éxito con JSON)

#### TipsPanel (`components/chat/TipsPanel.tsx`)
- `Sheet` de Radix que desliza desde la derecha (420px en desktop, full en móvil)
- Header con gradiente `#5B5CF6 → #A855F7`
- 5 tabs de industria: Restaurantes, Retail, Gasolineras, E-commerce, Apps móviles
- Cada tab: prompt de ejemplo en "terminal" (fondo `#0A0F1A`, texto `#22C55E`, `font-mono`), badge de validación verde, botón "Usar este ejemplo" (copia al textarea del chat y cierra el panel), 3 tips adicionales
- Card final "💡 El secreto de un buen prompt" con 5 consejos (en fondo `#EEF2FF`)

#### ChatInput (`components/chat/ChatInput.tsx`)
- `TextareaAutosize`: min 1 fila, max 6 filas, crece automáticamente
- **Enter** = enviar mensaje, **Shift+Enter** = salto de línea
- Contador de caracteres `0 / 1000` que cambia a naranja en > 800
- Botón enviar: gradiente circular, disabled (opacidad 0.3) si vacío, spinner `Loader2` durante carga
- Borde de la caja cambia a `#5B5CF6` cuando hay contenido
- Link "Tips de prompts →" con ícono `Lightbulb` que abre TipsPanel

#### ChatArea (`components/chat/ChatArea.tsx`)
Máquina de estados visual con 4 estados:
- **`idle`**: ícono `Sparkles` flotando con Framer Motion, título, subtítulo, 4 cards de sugerencias clicables (Ruleta, Puntos, Cupón, Factura por ticket). Cada card cambia color de borde al hover.
- **`loading`**: 3 mensajes de la IA que aparecen en secuencia con delay de 800ms cada uno usando `AnimatePresence`
- **mensajes activos**: burbujas de usuario (derecha, `#5B5CF6`) y de IA (izquierda, `#1E293B`) con timestamp. Auto-scroll con `useRef + useEffect`.
- **`results`**: renderiza `ResultadosAnalisis`

#### ResultadosAnalisis (`components/chat/ResultadosAnalisis.tsx`)
- Animación slideUp con Framer Motion al aparecer
- **Header:** ícono `CheckCircle2` verde, nombre de campaña en badge
- **Sección verde:** lista de items `puede_hacer[]` con stagger animation (cada item entra con 70ms de diferencia)
- **Sección naranja:** tabla de 3 columnas (`Lo que pediste | Limitación | Alternativa`) con filas alternadas, solo visible si hay items en `alternativas[]`
- **Resumen de configuración:** 6 cards en grid 2x3 (Tipo, Canal, Condición, Frecuencia, Vigencia, Premios/Puntos)
- **3 botones:** "Continuar al wizard →" (gradiente), "Ajustar descripción" (oscuro), "Empezar de cero" (texto pequeño)

#### Página /chat (`app/chat/page.tsx`)
- Fondo `#0F172A`, `h-screen overflow-hidden`
- **Sidebar izquierdo** (desktop, `w-72 bg-[#1E293B]`):
  - Link ← de regreso a `/`
  - Logo FREEPOL en blanco
  - Botón "Nueva campaña" (limpia el estado completo)
  - Historial simulado con 3 items (visual, sin funcionalidad real aún)
  - Link "Guía de prompts" que abre TipsPanel
  - Link "Iniciar sesión para guardar"
- **Sidebar móvil:** overlay con `bg-black/60` de fondo, el sidebar desliza desde la izquierda
- **Header móvil:** hamburguesa + logo + ícono de tips
- **Orquestación de estado:** `useState` para `inputValue`, `mensajes[]`, `estado`, `resultado`, `promptAnterior`
- **Flujo completo:**
  1. Usuario escribe y envía → `fetch POST /api/analizar-prompt`
  2. Estado cambia a `loading` → ChatArea muestra los 3 mensajes secuenciales
  3. Si éxito → agrega mensaje de IA + cambia estado a `results` + guarda `resultado`
  4. Si error → `react-hot-toast` con mensaje de error + vuelve a `idle`
- **react-hot-toast** configurado con tema oscuro (`#1E293B`, borde `#334155`, `border-radius: 12px`)

---

## 8. HISTORIAL DE COMMITS (rama develop)

| Hash | Tipo | Descripción |
|---|---|---|
| `9dd2ec1` | feat(landing) | Add 'Probar IA' CTA linking to /chat from navbar and hero |
| `949dfe9` | feat(chat) | Add /chat page with dark layout, sidebar and full chat orchestration |
| `614b993` | feat(chat) | Add full AI chat interface components |
| `48a4571` | feat(api) | Add POST /api/analizar-prompt with rate limiting and validation |
| `63d9519` | feat(ai) | Add Claude API client with retry logic and timeout |
| `0dd89b1` | feat(types) | Add TypeScript types for campaign module |
| `2cbb3bc` | chore(deps) | Add @anthropic-ai/sdk, react-textarea-autosize, react-hot-toast and uuid |
| `d018939` | fix(auth) | Enable scroll on dialog overlay for tall register form |
| `e347870` | feat(landing) | Assemble full landing page in app/page.tsx |
| `fc9a8bd` | feat(landing) | Add all remaining landing page sections |
| `d19f70d` | feat(landing) | Add hero section with animated chat mockup |
| `f2a5232` | feat(auth) | Add login and register dialog with Supabase and react-hook-form |
| `ed6ffc6` | feat(navbar) | Add fixed navbar with scroll behavior and mobile sheet menu |
| `f683dd2` | feat(ui) | Add shadcn/ui base components and custom primitives |
| `51d9fda` | chore(lib) | Add Supabase browser client and useScrollAnimation hook |
| `12735ef` | chore(config) | Add layout with Inter font, metadata and global CSS variables |
| `7554029` | chore(deps) | Initialize Next.js 14 project with TypeScript and Tailwind |
| `3e5373d` | chore(repo) | Add gitignore for Next.js project |
| `dc984df` | — | Initial commit |

---

## 9. LO QUE FALTA POR CONSTRUIR

### PRIORIDAD ALTA (núcleo del producto)

#### Wizard de 10 pasos (`/wizard` o modal)
El wizard es el corazón del flujo de creación. Se abre al hacer clic en "Continuar al wizard →" y llega **pre-llenado** con los datos que Claude extrajo.

Pasos estimados:
1. **Confirmación de tipo** — mostrar el tipo detectado (ruleta/puntos/cupón/factura) con opción de cambiar
2. **Nombre y negocio** — nombre del negocio y nombre de la campaña
3. **Canales** — seleccionar WhatsApp, Telegram, Instagram, Landing (multi-select)
4. **Condición de participación** — correo, teléfono, quiz o libre
5. **Premios** (si es ruleta) — hasta 3 premios con nombre y probabilidad (debe sumar 100%)
6. **Puntos** (si es puntos/factura) — monto_base, puntos_por_monto, meta_canje
7. **Frecuencia y vigencia** — fechas inicio/fin, horarios, días activos
8. **Límites** — máximo de participantes, horas de expiración del código
9. **Mensaje de bienvenida** — texto personalizable pre-llenado por IA
10. **Confirmación final** — resumen completo + botón "Lanzar campaña"

**Tecnología sugerida:** estado global con Zustand o React Context. Cada paso como componente separado. Barra de progreso animada.

#### Dashboard (`/dashboard`)
- Autenticación requerida (middleware de Supabase)
- Lista de campañas del usuario
- Métricas: participantes, conversiones, premios entregados
- Acciones: pausar, activar, duplicar, ver resultados
- Navegar al chat para crear nueva campaña

#### Base de datos (Supabase / PostgreSQL)
Tablas que necesitan crearse:
- `empresas` — razón social, logo, configuración
- `campanas` — toda la `ConfigCampana` + estado (borrador/activa/pausada/terminada) + created_by
- `participantes` — email/teléfono, campaña, fecha, código generado, premio ganado, canjeado
- `premios_entregados` — registro de cada premio asignado con hash SHA-256
- `facturas` — imagen, monto parseado por OCR, puntos asignados (para tipo factura)

#### Seguridad de códigos de premio
- UUID v4 + hash SHA-256 para códigos únicos (regla fija del proyecto)
- Validación server-side de cada código antes de marcar como canjeado
- Anti-duplicación: verificar que el mismo email/teléfono no haya participado en la misma campaña más de lo permitido

#### Lógica del servidor de la ruleta
- **Regla crítica:** el resultado de la ruleta **siempre se calcula en el servidor** (nunca en el cliente) para prevenir manipulación
- Algoritmo de pesos por probabilidad
- Rate limiting por participante (por IP + por email + por campaña)

---

### PRIORIDAD MEDIA

#### Páginas de campaña públicas (`/c/[slug]`)
- Landing page generada automáticamente para cada campaña
- Ruleta animada (CSS o Framer Motion)
- Formulario de participación (email/teléfono según condición)
- Mensaje de resultado con código QR
- Responsive y optimizada para móvil

#### Integración WhatsApp
- Bot de WhatsApp usando Twilio o WhatsApp Business API
- Flujo conversacional: el usuario escribe al número → recibe link de campaña → participa → recibe código por WhatsApp

#### Integración Telegram
- Bot con `node-telegram-bot-api`
- Comandos: `/iniciar`, `/participar`, `/mis-puntos`, `/canjear`
- Recepción de fotos de facturas para campaña tipo `factura`

#### OCR para facturas
- Recibir imagen de factura por WhatsApp/Telegram
- Extraer monto total con Claude Vision o Tesseract.js
- Validar que sea una factura real y asignar puntos

#### Sistema de notificaciones
- Email transaccional (Resend o SendGrid): confirmación de participación, código de premio, recordatorios
- Push notifications por WhatsApp/Telegram

#### Deep linking
- Botón que abre directamente la app del cliente (Shopify, app propia)
- Parámetros UTM para tracking

---

### PRIORIDAD BAJA (futuro)

#### Página de Precios (`/precios`)
- Planes: Free (1 campaña activa), Pro ($X/mes, 10 campañas), Enterprise (ilimitado)

#### Guía de Prompts pública (`/guia`)
- Versión expandida del TipsPanel, optimizada para SEO

#### API pública para integraciones
- Webhooks cuando un participante gana
- API REST para consultar participantes desde sistemas externos

#### Multi-idioma
- Interfaz en español e inglés
- `next-intl` o `i18next`

#### Analytics avanzados
- Gráficas de conversión por día
- Embudo de participación (visitó → inició → completó → ganó → canjeó)
- Exportar CSV de participantes

---

## 10. REGLAS TÉCNICAS INAMOVIBLES DEL PROYECTO

Estas reglas fueron definidas al inicio y **nunca deben violarse**:

1. **TypeScript estricto** — nunca usar `any`, siempre tipar todo
2. **App Router de Next.js** — nunca usar Pages Router (`pages/`)
3. **El resultado de la ruleta SIEMPRE se calcula en el servidor** — nunca en el cliente
4. **Códigos de premio:** UUID v4 + hash SHA-256
5. **Siempre manejar estados de carga y error** en componentes
6. **Diseño mobile-first**, responsive en todo momento
7. **Usar siempre shadcn/ui** para componentes base
8. **Comentar el código en español**
9. **Conventional Commits en inglés** para todos los commits
10. **Trabajar siempre en rama `develop`** — main solo recibe merges cuando algo está completamente probado

---

## 11. CÓMO CORRER EL PROYECTO

```bash
# 1. Instalar dependencias
cd /Users/josueboror/CURSOR/FREEPOL/FREEPOL
npm install

# 2. Configurar variables de entorno
# Editar .env.local y agregar tu ANTHROPIC_API_KEY real

# 3. Correr en desarrollo
npm run dev

# 4. Abrir en el navegador
# Landing: http://localhost:3000
# Chat IA: http://localhost:3000/chat
# API:     http://localhost:3000/api/analizar-prompt (solo POST)
```

### Probar la API de Claude directamente:
```bash
curl -X POST http://localhost:3000/api/analizar-prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Quiero una ruleta para mi restaurante Sabores del Sur este mes de abril. Los clientes validan su correo y pueden girar una vez. Premios: 15% descuento (50%), postre gratis (35%), menú completo gratis (15%). Del 1 al 30 de abril en WhatsApp."}'
```

### Prompt de prueba end-to-end recomendado:
```
Quiero una ruleta para mi restaurante Sabores del Sur este mes de abril.
Los clientes validan su correo y pueden girar una vez al día.
Premios: 15% de descuento (50%), postre gratis (35%), menú completo gratis (15%).
Vigente del 1 al 30 de abril en WhatsApp y Telegram.
Máximo 5000 participantes.
```

---

## ACTUALIZACIÓN — 20 de marzo de 2026 (Sesión 2)

### ✅ WIZARD COMPLETO DE 10 PASOS

Se construyó el componente más importante del flujo de FREEPOL: el wizard que recibe la configuración generada por Groq y permite al empresario confirmarla paso a paso antes de lanzar la campaña.

---

### Nuevas dependencias instaladas

| Paquete | Versión | Propósito |
|---|---|---|
| `zustand` | latest | Estado global del wizard |
| `date-fns` | latest | Cálculo de diferencia de fechas en Paso 7 |
| `canvas-confetti` | latest | Efecto de celebración al lanzar campaña |
| `@types/canvas-confetti` | latest | Tipos TypeScript para canvas-confetti |
| `@radix-ui/react-progress` | latest | Base para barra de progreso |
| `@radix-ui/react-select` | latest | Componente select accesible |
| `@radix-ui/react-checkbox` | latest | Componente checkbox accesible |
| `@radix-ui/react-tooltip` | latest | Tooltips accesibles |
| `@radix-ui/react-slider` | latest | Slider accesible |

---

### Archivos creados

#### `store/wizardStore.ts`
Store central de Zustand para el wizard. Contiene:
- Estado: `paso`, `totalPasos` (10), `config: ConfigCampana`, `errores`, `guardando`, `completado`, `hayDatos`
- Acciones de navegación: `setPaso`, `siguientePaso`, `anteriorPaso`
- Acciones de config: `setConfig`, `setConfigCompleta`
- Acciones de errores: `setError`, `limpiarError`, `limpiarErrores`
- Función `cargarDesdeLocalStorage`: lee la clave `freepol_config` del localStorage, parsea el JSON y llama a `setConfigCompleta` si existe `config` dentro

#### `app/wizard/page.tsx`
Página principal del wizard en ruta `/wizard`. Accesible sin autenticación.
- Layout oscuro (#0F172A) igual que `/chat`
- `Progress` animado en la parte superior (gradiente #5B5CF6 → #A855F7, h-1)
- Header fijo: logo FREEPOL, link "Volver al chat", texto "Paso X de 10"
- Área central scrolleable `max-w-2xl mx-auto`
- Footer fijo: botón "← Atrás" (oculto en paso 1), indicadores de paso (pills), botón "Siguiente →" o "Lanzar campaña" en paso 10
- `AnimatePresence` de Framer Motion: transición entre pasos (salida/entrada lateral, 250ms, ease easeInOut)
- Si no hay datos en localStorage: muestra pantalla de error con botón "Ir al asistente de IA"
- Validación por paso: paso 2 requiere nombre negocio ≥2 chars y nombre campaña ≥3 chars; paso 5 requiere probabilidades que sumen 100%; paso 7 requiere fechas válidas

#### `components/wizard/PasoLayout.tsx`
Wrapper reutilizable para cada paso. Props: `titulo`, `subtitulo`, `icono: LucideIcon`, `children`, `badge?: string`.
- Ícono en cuadrado redondeado con gradiente (28px, shadow #5B5CF6/20)
- Badge opcional encima del título (estilo pill con borde #C4B5FD)
- Título `text-2xl font-bold text-white`
- Subtítulo `text-[#94A3B8] text-base`
- Separador `h-px bg-[#334155]`
- Animación de entrada: fadeUp con Framer Motion delay 0.1s

#### `components/wizard/pasos/Paso1TipoCampana.tsx`
- Ícono: Sparkles — badge "Pre-detectado por IA"
- Grid 2x2 de cards de selección: Ruleta (Trophy #F59E0B), Puntos (Star #22C55E), Cupón (Ticket #5B5CF6), Factura (Receipt #A855F7)
- Selección marcada con `border-[#5B5CF6]` + indicador circular blanco
- Pre-seleccionado con `config.tipo` del store

#### `components/wizard/pasos/Paso2Identidad.tsx`
- Ícono: Building2
- Input "Nombre de tu empresa" — pre-llenado con `config.nombre_negocio`, requerido ≥2 chars
- Input "Nombre de la campaña" — pre-llenado con `config.nombre_campana`, requerido ≥3 chars
- Preview en tiempo real debajo: muestra "[negocio] presenta: [campaña]", actualiza con debounce 300ms

#### `components/wizard/pasos/Paso3Canales.tsx`
- Ícono: Radio
- 4 toggle cards multi-selección: WhatsApp (#22C55E), Telegram (#38BDF8), Instagram (#E1306C), Landing (#5B5CF6)
- Switch toggle visual integrado en cada card
- Nota informativa azul: "La Landing Page siempre se crea..."
- Si `config.canal === 'todos'`, activa los 4

#### `components/wizard/pasos/Paso4Condicion.tsx`
- Ícono: ShieldCheck
- 4 cards de selección única: correo (badge "Recomendado" verde), teléfono, quiz (badge "Mayor engagement" naranja), libre (badge "Sin datos" gris)
- Radio button visual circular en cada card

#### `components/wizard/pasos/Paso5Premios.tsx`
UI adaptativa según `config.tipo`:
- **Ruleta**: 3 filas de premios (nombre + % probabilidad), SVG dinámico de ruleta que se actualiza en tiempo real, barra de progreso de probabilidad total (verde=100%, naranja<100%, rojo>100%), botón agregar 3er premio opcional
- **Puntos/Factura**: inputs "X puntos por cada $Y", meta de canje, calculadora visual que muestra cuántas compras necesita el cliente
- **Cupón**: input del beneficio, toggle de deep linking con input URL

#### `components/wizard/pasos/Paso6Frecuencia.tsx`
- Ícono: RefreshCw
- 4 cards: "1 vez total" (Target), "1 vez por día" (Calendar, badge "Más popular" azul), "1 vez por semana" (CalendarDays), "Sin límite" (Infinity, badge "Mayor riesgo" naranja)

#### `components/wizard/pasos/Paso7Vigencia.tsx`
- Ícono: CalendarRange
- Date pickers nativos `type="date"` con `[color-scheme:dark]`
- Resumen visual verde: "Tu campaña estará activa X días" (calculado con `date-fns differenceInDays`)
- Toggle "¿Horario específico?": si activo, muestra time pickers + pills de días de la semana (L M X J V S D)
- Pre-llenado con `config.fecha_inicio`, `config.fecha_fin`, `config.horario_inicio`, `config.horario_fin`, `config.dias_activos`

#### `components/wizard/pasos/Paso8Limites.tsx`
- Ícono: Gauge
- Toggle "Limitar participantes" + input número si activo
- 4 pills de expiración del código: 24h, 48h (badge "Recomendado"), 72h, 1 semana
- Pre-llenado con `config.limite_participantes` y `config.horas_expiracion_codigo`

#### `components/wizard/pasos/Paso9Mensaje.tsx`
- Ícono: MessageSquare
- Textarea con máximo 200 caracteres, contador en tiempo real (naranja >180)
- Botón "✨ Regenerar con IA" — llama a `/api/generar-mensaje`, muestra spinner Loader2
- Preview estilo WhatsApp: burbuja verde con el texto del mensaje, nombre del negocio como remitente
- Botones de ajuste de tono: "Más formal", "Más amigable", "Más corto"
- Pre-llenado con `config.mensaje_bienvenida`

#### `components/wizard/pasos/Paso10Resumen.tsx`
- Ícono: CheckCircle2
- Grid 2 columnas de `CardResumen`: cada card muestra label, valor y ícono lápiz (Pencil) al hover que llama `setPaso(n)` para volver sin perder datos
- Lista verde "Lo que FREEPOL va a crear": landing page URL, bots, códigos QR, dashboard, panel cajeros
- Botón "🚀 Lanzar mi campaña" con animación pulse suave y gradiente
- Al lanzar: llama `/api/crear-campana`, dispara `canvas-confetti`, limpia localStorage, muestra pantalla de éxito y redirige a `/dashboard` tras 3 segundos

#### `components/ui/progress.tsx`
Barra de progreso usando `@radix-ui/react-progress`. Gradiente horizontal #5B5CF6 → #A855F7, transición 500ms.

#### `components/ui/checkbox.tsx`
Checkbox usando `@radix-ui/react-checkbox`. Tema oscuro: fondo #1E293B, borde #475569, check azul #5B5CF6 al activar.

#### `components/ui/textarea.tsx`
Textarea con estilos del tema oscuro del wizard: bg #1E293B, borde #334155, texto #E2E8F0, focus borde #5B5CF6.

---

### Archivos modificados

#### `app/chat/page.tsx`
- **Importación**: agregado `useRouter` de `next/navigation`
- **`enviarMensaje`**: después de recibir la respuesta de Groq y antes de `setResultado(data)`, guarda `JSON.stringify(data)` en `localStorage.setItem('freepol_config', ...)` para que el wizard lo consuma
- **`handleContinuarWizard`**: reemplazado el `toast.success` placeholder por `router.push('/wizard')`, conectando el botón "Continuar al wizard →" de `ResultadosAnalisis` con la ruta real

---

### Nuevos API Routes

#### `app/api/generar-mensaje/route.ts`
- Método: `POST`
- Recibe: `{ config: ConfigCampana }`
- Llama a Groq (`llama-3.3-70b-versatile`, max 100 tokens) con prompt en español para generar mensaje de bienvenida ≤150 caracteres
- Devuelve: `{ mensaje: string }`

#### `app/api/crear-campana/route.ts`
- Método: `POST`
- Recibe: `{ config: ConfigCampana }`
- Genera slug URL-safe: `nombre_campana → lowercase → normalizar acentos → reemplazar non-alphanum por guión → + '-' + Date.now().toString(36)`
- Inserta en tabla `campanas` de Supabase con estado inicial `'activa'`
- Devuelve: `{ id, slug, url_campana: '/c/[slug]' }`

---

### Tabla de Supabase creada (SQL)

```sql
CREATE TABLE campanas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre_negocio TEXT NOT NULL,
  nombre_campana TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('ruleta','puntos','cupon','factura')),
  canales TEXT[] NOT NULL DEFAULT '{}',
  estado TEXT NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa','pausada','terminada','borrador')),
  configuracion JSONB NOT NULL DEFAULT '{}',
  total_participantes INTEGER DEFAULT 0,
  total_canjes INTEGER DEFAULT 0,
  creado_por UUID REFERENCES auth.users(id),
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campanas_slug ON campanas(slug);
CREATE INDEX idx_campanas_estado ON campanas(estado);
CREATE INDEX idx_campanas_creado_por ON campanas(creado_por);

ALTER TABLE campanas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica de campanas activas"
  ON campanas FOR SELECT USING (estado = 'activa');

CREATE POLICY "Insercion autenticada"
  ON campanas FOR INSERT WITH CHECK (true);
```

---

### Flujo completo implementado

```
/chat → escribir prompt → Groq analiza → ResultadosAnalisis
→ localStorage.setItem('freepol_config', data)
→ router.push('/wizard')
→ WizardPage: cargarDesdeLocalStorage() → pre-llena los 10 pasos
→ Empresario confirma paso a paso
→ Paso 10: "🚀 Lanzar" → POST /api/crear-campana
→ Supabase inserta campaña → confetti → pantalla de éxito
→ router.push('/dashboard')
```

---

### Tareas pendientes actualizadas

- [ ] **Alta prioridad**: Construir el dashboard `/dashboard` con métricas en tiempo real
- [ ] **Alta prioridad**: Construir páginas públicas de campaña `/c/[slug]`
- [ ] **Alta prioridad**: Implementar seguridad de códigos de premio (UUID v4 + SHA-256) y lógica de ruleta en servidor
- [ ] **Media prioridad**: Integrar bots de WhatsApp y Telegram (`node-telegram-bot-api`)
- [ ] **Media prioridad**: Implementar OCR para validación de facturas
- [ ] **Media prioridad**: Sistema de notificaciones (email, push)
- [ ] **Media prioridad**: Deep linking funcional
- [ ] **Baja prioridad**: Página de precios `/precios`
- [ ] **Baja prioridad**: Página pública "Guía de Prompts" `/guia`
- [ ] **Baja prioridad**: API pública para integraciones

---

*Actualización agregada el 20 de marzo de 2026.*

---

## ACTUALIZACIÓN — 20 de marzo de 2026 (Sesión 3)

### ✅ LANDING PÚBLICA DE CAMPAÑA + MOTOR DE CÓDIGOS CON ANTIFRAUDE

Se construyó el motor completo de participación del cliente final: la landing pública `/c/[slug]`, los componentes de actividad (ruleta, cupón, puntos), y el sistema antifraude con Upstash Redis + SHA-256.

---

### Nuevas dependencias instaladas

| Paquete | Versión | Propósito |
|---|---|---|
| `@upstash/redis` | latest | Antifraude en tiempo real (locks, deduplicación por IP) |
| `qrcode.react` | latest | Generación de QR para códigos de premio |
| `@types/qrcode.react` | latest | Tipos TypeScript para qrcode.react |

---

### SQL adicional para Supabase

Se crearon 2 nuevas tablas:

**`participantes`** — Almacena los datos de cada participante por campaña con restricciones UNIQUE para evitar duplicados de correo/teléfono por campaña.

**`codigos`** — Almacena cada código de premio con su hash SHA-256 de verificación, estado de uso, fecha de uso y expiración.

**`puntos_participantes`** — (usada por `procesar-factura`) Acumula puntos por participante por campaña con UPSERT.

Todos con RLS habilitado y políticas de lectura/inserción pública para el flujo sin auth.

---

### Archivos creados

#### `lib/redis.ts`
Cliente global de Upstash Redis. Exporta:
- `redis` — instancia de `Redis` de `@upstash/redis`
- `setConExpiracion(key, value, segundos)` — guarda con TTL
- `existe(key)` — verifica si una clave existe (antifraude)
- `eliminar(key)` — elimina una clave (liberar locks)
- `setNX(key, value, segundos)` — SET atómico solo si no existe, devuelve `boolean`. Usado para lock de doble canje.

#### `lib/codigos.ts`
Motor de generación y validación de códigos. Exporta:
- `generarCodigoUnico(prefijo)` — formato `XXXX-YYYY-ZZZZ`, usando `randomBytes(2).toString('hex').toUpperCase()` por segmento. Ejemplo: `POLL-A2F9-K7M3`
- `generarHash(codigo)` — SHA-256 de `codigo + HASH_SECRET`
- `calcularExpiracion(horas)` — `new Date(Date.now() + horas * ms)`
- `validarYUsarCodigo(codigoTexto, supabase)` — validación en 7 pasos: existencia → ya usado → expirado → hash válido → lock Redis NX → UPDATE Supabase → liberar lock. Devuelve `ResultadoValidacion`

#### `lib/supabase-server.ts`
Cliente de Supabase para Server Components y API Routes. Usa `createClient` de `@supabase/supabase-js` con las variables de entorno del servidor.

#### `app/c/[slug]/page.tsx`
Página pública de campaña. Server Component.
- `generateMetadata` dinámica: título "[campaña] — [negocio]", description con el mensaje de bienvenida
- Si slug no existe: página 404 personalizada con logo FREEPOL y botón "Volver al inicio"
- Si estado ≠ 'activa': página de campaña finalizada/pausada con mensaje elegante según el estado
- Si activa: renderiza `LandingCampana` con la fila completa de Supabase

#### `components/campana/LandingCampana.tsx`
Componente principal de la landing del cliente final. Diseño mobile-first, max-w-lg, sin navbar de FREEPOL.
- **Zona 1 (Header)**: nombre del negocio en color primario, nombre de campaña, badge naranja si hay horario activo
- **Zona 2 (Mensaje)**: card `#F8FAFC` con mensaje de bienvenida y fecha fin
- **Zona 3 (Formulario)**: react-hook-form. Inputs adaptativos según `condicion` (correo, teléfono, libre). POST a `/api/registrar-participante`. Manejo de errores por límite, IP duplicada o ya registrado.
- **Zona 4 (Actividad)**: `AnimatePresence` transiciona desde formulario al componente de actividad tras registro exitoso. Renderiza `ComponenteRuleta`, `ComponenteCupon` o `ComponentePuntos` según `tipo`
- **Zona 5 (Footer)**: "Powered by FREEPOL" + links Términos/Privacidad

#### `components/campana/ComponenteRuleta.tsx`
Ruleta funcional SVG. El resultado SIEMPRE viene del servidor.
- **`RuletaSVG`**: genera secciones con `pathArco()` calculando arcos SVG dinámicos según probabilidades. Texto de premios rotado al centro de cada sección. Puntero SVG fijo arriba. Animación CSS `transform: rotate()` + `transition: transform 3s cubic-bezier`.
- **Flujo de giro**: (1) usuario presiona → (2) giro visual rápido de 720° mientras espera API → (3) API devuelve `prize_index` → (4) calcula ángulo de parada para esa sección + variación aleatoria ±10° → (5) anima desaceleración 3s → (6) espera 3.2s → (7) muestra pantalla de resultado
- **Pantalla de resultado**: Trophy, "¡Ganaste!", premio, código en `font-mono` con botón copiar, `QRCodeSVG` 200x200, botón "Descargar QR" que usa canvas para exportar como PNG, texto de expiración

#### `components/campana/ComponenteCupon.tsx`
Para campañas de tipo cupón directo. Al montar llama automáticamente a `/api/generar-codigo`.
- Skeleton animado mientras carga
- Al recibir: confetti, código con botón copiar, `QRCodeSVG` 180x180, botón "Descargar QR", botón "Abrir en la App →" si hay `deep_link_url` (con fallback a nueva pestaña a los 2s)

#### `components/campana/ComponentePuntos.tsx`
Para campañas de puntos y factura.
- Barra de progreso animada con Framer Motion, gradiente #5B5CF6 → #22C55E
- Si `tipo === 'factura'`: botón "Subir foto de factura" con `input[type=file][capture=environment]`, llama a `/api/procesar-factura`, actualiza barra en tiempo real
- Si `tipo === 'puntos'`: instrucciones de acumulación
- Al alcanzar la meta: botón "¡Canjear mi premio! →" que llama a `/api/generar-codigo` y muestra QR del código

---

### Nuevos API Routes

#### `app/api/registrar-participante/route.ts`
POST — registra al cliente en la campaña con antifraude completo:
1. Verifica campaña activa en Supabase
2. Verifica límite de participantes
3. Verifica IP duplicada en Redis (24h TTL con key `ip:[campana_id]:[ip]`)
4. Si correo/teléfono ya existe → devuelve `ya_registrado: true, participante_id`
5. Inserta en tabla `participantes`
6. Incrementa `total_participantes` en `campanas`
7. Guarda IP en Redis por 24h

#### `app/api/girar-ruleta/route.ts`
POST — endpoint más crítico de seguridad. Resultado calculado 100% en servidor:
1. Verifica Redis `giro:[participante_id]:[campana_id]` — si existe: `ya_participo`
2. Carga campaña y sus premios
3. Algoritmo de pesos: `random * 100`, acumula probabilidades, selecciona premio
4. Genera código con prefijo del negocio + `randomBytes`
5. Genera hash SHA-256 del código
6. Guarda en tabla `codigos` de Supabase
7. Guarda `giro:...` en Redis con TTL = segundos hasta `fecha_fin` de la campaña
8. Incrementa `total_canjes`
9. Devuelve `{ premio, prize_index, codigo, expira_en }`

#### `app/api/generar-codigo/route.ts`
POST — genera código para cupón o canje de puntos:
- Si Redis `cupon:[participante_id]:[campana_id]` existe: busca y devuelve el código existente
- Si no: verifica límite, genera código, guarda en Supabase y Redis

#### `app/api/procesar-factura/route.ts`
POST (FormData) — procesa imagen de factura:
- Por ahora: datos simulados (OCR pendiente)
- Calcula puntos según `puntos_por_monto` / `monto_base` de la campaña
- UPSERT en tabla `puntos_participantes`
- Devuelve puntos ganados, total acumulado, si alcanzó meta
- Comentario TODO: integrar Google Cloud Vision API

#### `app/api/validar-codigo/route.ts`
POST — llama a `validarYUsarCodigo()` de `lib/codigos.ts`. Devuelve `ResultadoValidacion` directamente.

---

### Página creada

#### `app/validar/page.tsx`
Página para cajeros. Sin autenticación. Accesible en `/validar`.
- Input `font-mono text-xl text-center` con auto-formato al escribir (`XXXX-XXXX-XXXX`)
- Auto-envío cuando el código tiene formato completo (14 chars)
- Pantalla verde `CheckCircle` con premio y nombre del negocio al validar exitosamente
- Pantalla roja `XCircle` con la razón del rechazo
- Botón "Validar otro código" / "Intentar otro código" según resultado

---

### Variables de entorno agregadas a `.env.local`

```env
UPSTASH_REDIS_REST_URL=tu_url_de_upstash
UPSTASH_REDIS_REST_TOKEN=tu_token_de_upstash
HASH_SECRET=freepol_secret_2025_muy_larga_y_segura
```

Obtener credenciales de Upstash en: [console.upstash.com](https://console.upstash.com) → crear base de datos Redis → copiar REST URL y REST TOKEN.

---

### Flujo completo de prueba

```
1. Crear campaña en /wizard → campaña guardada en Supabase con slug

2. Ir a /c/[slug-de-la-campana]
   → Ingresar correo → POST /api/registrar-participante
   → participante_id guardado en estado del componente

3. [Si tipo = 'ruleta']:
   → Botón "¡Girar!" → POST /api/girar-ruleta
   → Servidor calcula resultado → devuelve prize_index y código
   → Ruleta SVG anima y para en el premio correcto
   → Pantalla de resultado: código + QR

4. Ir a /validar
   → Escribir el código: XXXX-XXXX-XXXX
   → Auto-envía cuando está completo
   → POST /api/validar-codigo → valida hash SHA-256 + marca usado=true
   → Pantalla verde con el premio ganado
```

### Verificación del antifraude

**Intento de doble giro**: Girar nuevamente con el mismo participante_id → Redis devuelve que ya existe `giro:[id]:[campana_id]` → respuesta `{ error: 'ya_participo', status: 409 }`

**Intento de doble validación**: Usar el mismo código dos veces en `/validar` → primer intento marca `usado=true` en Supabase → segundo intento: `{ valido: false, razon: 'Este código ya fue utilizado' }`

**Condición de carrera**: Dos peticiones simultáneas de validación del mismo código → `setNX` de Redis garantiza que solo una adquiere el lock → la otra recibe `{ valido: false, razon: 'Código en proceso' }`

---

### Tareas pendientes actualizadas

- [ ] **Alta prioridad**: Construir el dashboard `/dashboard` con métricas en tiempo real
- [x] ~~Construir páginas públicas de campaña `/c/[slug]`~~ ✓ Completado
- [x] ~~Implementar seguridad de códigos (UUID + SHA-256) y lógica de ruleta en servidor~~ ✓ Completado
- [ ] **Alta prioridad**: Crear tabla `puntos_participantes` en Supabase para el módulo de puntos
- [ ] **Media prioridad**: Integrar OCR real con Google Cloud Vision API en `/api/procesar-factura`
- [ ] **Media prioridad**: Integrar bots de WhatsApp y Telegram
- [ ] **Media prioridad**: Sistema de notificaciones (email al ganar un premio)
- [ ] **Baja prioridad**: Páginas `/terminos`, `/privacidad`, `/precios`, `/guia`
- [ ] **Baja prioridad**: API pública para integraciones

---

*Actualización agregada el 20 de marzo de 2026.*

---

## Módulo 5: Autenticación de Empresas, Dashboard, Páginas Públicas y Colaboraciones

### Fecha: 20 de marzo de 2026

### Resumen de lo construido

Se completó el flujo completo de autenticación para empresas, el dashboard con métricas reales, las páginas públicas de precios y guía de prompts, la personalización del chat por empresa, y el sistema de colaboraciones (alianzas) entre empresas.

---

### Dependencias instaladas

```bash
npm install @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-switch
```

---

### SQL adicional para Supabase

```sql
-- Tabla de empresas
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  sitio_web TEXT,
  color_primario TEXT DEFAULT '#5B5CF6',
  color_secundario TEXT DEFAULT '#22C55E',
  logo_url TEXT,
  industria TEXT DEFAULT 'otro',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','starter','pro','enterprise')),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE empresa_miembros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rol TEXT DEFAULT 'miembro' CHECK (rol IN ('admin','editor','miembro')),
  invitado_en TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(empresa_id, user_id)
);

CREATE INDEX idx_empresas_owner ON empresas(owner_id);
CREATE INDEX idx_miembros_empresa ON empresa_miembros(empresa_id);
CREATE INDEX idx_miembros_user ON empresa_miembros(user_id);

ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresa_miembros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner lee su empresa" ON empresas FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Owner crea empresa" ON empresas FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner actualiza empresa" ON empresas FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Miembros leen empresa" ON empresa_miembros FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin agrega miembros" ON empresa_miembros FOR INSERT WITH CHECK (true);

-- Tabla de alianzas entre empresas
CREATE TABLE campana_aliados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campana_id UUID NOT NULL REFERENCES campanas(id) ON DELETE CASCADE,
  empresa_emisora_id UUID NOT NULL REFERENCES empresas(id),
  empresa_receptora_id UUID REFERENCES empresas(id),
  correo_aliado TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente','activa','rechazada')),
  token_invitacion UUID DEFAULT gen_random_uuid(),
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  aceptado_en TIMESTAMPTZ
);

CREATE INDEX idx_aliados_campana ON campana_aliados(campana_id);
CREATE INDEX idx_aliados_token ON campana_aliados(token_invitacion);

ALTER TABLE campana_aliados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Empresas ven sus alianzas" ON campana_aliados FOR SELECT USING (true);
CREATE POLICY "Insercion alianzas" ON campana_aliados FOR INSERT WITH CHECK (true);
CREATE POLICY "Update alianzas" ON campana_aliados FOR UPDATE USING (true);
```

---

### Archivos creados

| Archivo | Descripción |
|---|---|
| `lib/empresa.ts` | `getEmpresaDelUsuario`, `crearEmpresa`, `actualizarEmpresa`. Interface `Empresa`. |
| `lib/auth-helpers.ts` | `getUsuarioActual`, `getUsuarioConEmpresa`. Wrappers sobre Supabase Auth. |
| `components/ui/accordion.tsx` | Componente shadcn/ui Accordion con Radix UI. |
| `components/ui/avatar.tsx` | Componente shadcn/ui Avatar con Radix UI. |
| `components/ui/dropdown-menu.tsx` | Componente shadcn/ui DropdownMenu con Radix UI. |
| `components/ui/switch.tsx` | Componente shadcn/ui Switch con Radix UI. |
| `app/onboarding/page.tsx` | Onboarding de 3 pasos: (1) nombre + industria (9 opciones), (2) colores de marca con preview en tiempo real, (3) confirmación + confetti. Pre-llena de `localStorage('freepol_registro')`. Llama `crearEmpresa()` al finalizar. |
| `app/dashboard/page.tsx` | Dashboard principal con verificación de sesión. 4 cards de métricas (campañas activas, participantes, canjes, tasa conversión). Tabla de campañas con acciones (ver landing, pausar/activar). Sección de alianzas activas. FAB flotante para nueva campaña. |
| `app/guia/page.tsx` | Página pública `/guia`. Hero, comparación prompt vago vs detallado, Accordion con 5 ingredientes, ejemplos por industria (5 tabs), FAQ de 8 preguntas, CTA final. |
| `app/precios/page.tsx` | Página pública `/precios`. Toggle mensual/anual (20% descuento). 4 planes: Free $0, Starter $19/$15, Pro $49/$39, Enterprise $149/$119. FAQ con Accordion. |
| `app/alianza/[token]/page.tsx` | Página pública para aceptar/rechazar invitación de alianza por token UUID. UPDATE en `campana_aliados`. Maneja estado ya procesado. |
| `components/wizard/pasos/Paso8bAliado.tsx` | Paso opcional del wizard (entre Paso 8 y 9). Toggle aliado, formulario con correo + nombre + checkbox. Guarda en `localStorage('freepol_aliado')`. Exporta `guardarAliado`, `leerAliado`, `limpiarAliado`. |

---

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `components/AuthDialog.tsx` | Post-login verifica empresa → `/dashboard` o `/onboarding`. Errores de Supabase traducidos al español. Registro guarda datos en `localStorage('freepol_registro')`. Campo `sitioWeb` opcional agregado. |
| `components/Navbar.tsx` | Detecta sesión con `getSession` y `onAuthStateChange`. Con sesión: avatar + DropdownMenu. Sin sesión: botones originales. Links "Precios" → `/precios`, "Guía de prompts" → `/guia`. |
| `app/chat/page.tsx` | Carga empresa via Supabase DB (cero tokens Groq). Historial real de campañas (últimas 3). Sidebar personalizado con nombre de empresa. Botón inferior cambia a "Ver mis campañas →". |
| `components/chat/ChatArea.tsx` | Props `empresa` y `ordenSugerencias`. Saludo personalizado con nombre. Sugerencias reordenadas por industria (`.sort()` en cliente). Prompts interpolados con nombre de empresa. |
| `components/CasosSection.tsx` | Agrega 4to caso: "Taquería Don Chema" (negocio local, naranja, métricas reales). |
| `components/LogosBar.tsx` | Subtítulo → "Desde taquerías locales hasta cadenas nacionales". |
| `app/page.tsx` | Agrega `id="producto"` y `id="casos"` para scroll desde navbar. |

---

### Notas técnicas importantes

**Cero tokens de Groq en personalización:**
La personalización del chat es 100% JavaScript del cliente. La función `analizarPromptEmpresario` solo se llama cuando el usuario presiona enviar en el chat. Las siguientes operaciones no consumen tokens: saludo personalizado (interpolación de string), historial real (query Supabase DB), reorden de sugerencias por industria (`Array.sort()`), prompts pre-llenados con nombre de empresa (`.replace()` en string).

**Reorden de sugerencias por industria (sin tokens):**
- `restaurantes` / `entretenimiento` → Ruleta primero
- `retail` / `gasolineras` → Puntos por Factura primero
- `ecommerce` → Cupón Directo primero
- Resto → orden normal

---

### Tareas pendientes actualizadas

- [x] ~~Construir el dashboard `/dashboard` con métricas en tiempo real~~ ✓ Completado
- [x] ~~Páginas `/precios` y `/guia`~~ ✓ Completado
- [x] ~~Autenticación de empresas con onboarding~~ ✓ Completado
- [x] ~~Personalización del chat por empresa (cero tokens Groq)~~ ✓ Completado
- [x] ~~Sistema de colaboraciones (alianzas) entre empresas~~ ✓ Completado
- [ ] **Alta prioridad**: Crear tabla `puntos_participantes` en Supabase para el módulo de puntos
- [ ] **Media prioridad**: Integrar OCR real con Google Cloud Vision API en `/api/procesar-factura`
- [ ] **Media prioridad**: Integrar bots de WhatsApp y Telegram
- [ ] **Media prioridad**: Sistema de notificaciones (email al ganar un premio)
- [ ] **Baja prioridad**: Páginas `/terminos`, `/privacidad`
- [ ] **Baja prioridad**: API pública para integraciones
- [ ] **Baja prioridad**: Panel de configuración de empresa (colores, logo, plan)

---

*Actualización agregada el 20 de marzo de 2026 — Módulo 5.*

---

## Módulo 6: Dashboard Completo con Realtime, Métricas Detalladas y Configuración

### Fecha: 20 de marzo de 2026

### Resumen de lo construido

Se construyó el dashboard completo del empresario: métricas en tiempo real con Supabase Realtime, lista de campañas con búsqueda/filtros/acciones, modal de QR con descarga PNG, métricas detalladas por campaña (incluyendo distribución de premios para ruletas), exportación de participantes a CSV, sección de alianzas y página de configuración de empresa.

---

### Dependencias instaladas

```bash
npm install @radix-ui/react-alert-dialog
```

---

### API Routes creadas

| Ruta | Método | Descripción |
|---|---|---|
| `app/api/campana/[id]/estado/route.ts` | `PATCH` | Pausa o activa una campaña. Requiere Bearer JWT en header `Authorization`. Verifica que el `creado_por` coincide con el usuario del token. Body: `{ estado: 'activa' \| 'pausada' \| 'terminada' }` |

---

### Componentes UI creados

| Archivo | Descripción |
|---|---|
| `components/ui/skeleton.tsx` | Skeleton animado (`animate-pulse`) para estados de carga. Compatible con tema oscuro del dashboard. |
| `components/ui/alert-dialog.tsx` | Modal de confirmación destructiva con Radix UI `@radix-ui/react-alert-dialog`. Exporta `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`. |

---

### Archivos creados

| Archivo | Descripción detallada |
|---|---|
| `components/dashboard/DashboardHeader.tsx` | Saludo dinámico según hora del día (buenos días/tardes/noches). Muestra nombre del usuario, nombre de la empresa, campañas activas y plan actual. Botón "Nueva campaña" con color `empresa.color_primario` via inline style (cero tokens Groq). Animación `fadeIn` desde arriba con Framer Motion delay 0.1s. |
| `components/dashboard/MetricasCards.tsx` | 4 cards animadas: Campañas activas, Total participantes, Canjes realizados, Tasa de conversión. `AnimatedNumber` local anima desde 0 al valor con ease-out. Skeleton loading mientras cargan. Supabase Realtime channel `metricas-[userId]` escucha `UPDATE` e `INSERT` en `campanas` y recalcula. Cleanup de canal en `useEffect return`. |
| `components/dashboard/ListaCampanas.tsx` | Lista completa de campañas con: búsqueda en tiempo real por nombre, filtros pills (Todas/Activas/Pausadas/Terminadas), tabla desktop con columnas (Campaña, Tipo, Estado con punto parpadeante si activa, Participantes con barra de progreso si hay límite, Canjes + conversión, Fecha relativa con `date-fns`), DropdownMenu de acciones (Ver landing, Copiar link, Ver QR, Ver métricas, Pausar/Activar, Eliminar). Cards responsive en móvil. Toggle estado vía `PATCH /api/campana/[id]/estado` con JWT + actualización optimista. AlertDialog de confirmación para eliminar (marca como terminada, no borra). Toast de confirmación en cada acción. |
| `components/dashboard/QRModal.tsx` | Dialog con QRCodeSVG de 220x220 (fondo blanco, foreground #0F172A, nivel H). URL copiable. Botón "Copiar link" con toast. Botón "Descargar PNG": convierte SVG a canvas 300x300, exporta via `URL.createObjectURL`, nombre: `[slug]-qr.png`. Instrucción para impresión. |
| `components/dashboard/AlianzasSection.tsx` | Solo visible si hay registros en `campana_aliados`. Carga alianzas con join a `campanas`. Tres estados: Pendiente (naranja, botón copiar link de invitación), Activa (verde, mensaje informativo), Rechazada (rojo). URL de invitación: `[BASE_URL]/alianza/[token_invitacion]`. |
| `app/dashboard/campana/[id]/page.tsx` | Métricas detalladas de una campaña. Auth guard: verifica sesión y que la campaña pertenece al usuario. Breadcrumb + header con nombre, estado y acciones. 4 cards de métricas rápidas (participantes, canjes, conversión, disponibles). **Para ruletas**: distribución de premios con barras dobles (probabilidad teórica azul vs resultado real verde), conteo de veces ganado por premio. **Para puntos/factura**: mecánica (puntos/monto, meta, metas alcanzadas). Tabla de últimos 50 participantes con columnas (identidad, fecha relativa, premio, estado del código). Botón "Exportar CSV": genera CSV con headers `correo,telefono,nombre,fecha_registro,premio,canjeado`, descarga via `Blob + URL.createObjectURL`, nombre: `[slug]-participantes.csv`. |
| `app/dashboard/config/page.tsx` | Configuración de empresa en 4 secciones. **Sección 1 - Datos**: nombre, sitio web, select de industria (9 opciones); llama `actualizarEmpresa()`. **Sección 2 - Colores**: input `type="color"` para primario y secundario; preview en tiempo real idéntico al onboarding; guarda colores separado de datos. **Sección 3 - Plan**: card con plan actual, límites, link a `/precios`; banner de upgrade si plan es `free`. **Sección 4 - Zona de peligro**: borde rojo, AlertDialog de confirmación; por ahora hace signOut y envía a soporte. |

---

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `app/dashboard/page.tsx` | Reescritura completa. Auth guard con skeleton loading (evita flash de contenido no autorizado). Navbar fijo con logo, links de navegación, badge de plan con colores por tier (Free/Starter/Pro/Enterprise), avatar con color de empresa, DropdownMenu completo, Sheet lateral para móvil. Realtime channel `participantes-[userId]` muestra toast con nombre/correo del nuevo participante. Cleanup de canales en `useEffect return`. Compone `DashboardHeader`, `MetricasCards`, `ListaCampanas`, `AlianzasSection`. |

---

### Notas técnicas importantes

**Supabase Realtime — dos canales:**
```
Canal 1 (MetricasCards): metricas-[userId]
  - Evento: UPDATE en campanas WHERE creado_por=eq.[userId]
  - Acción: recalcular las 4 métricas

Canal 2 (dashboard/page.tsx): participantes-[userId]
  - Evento: INSERT en participantes (cualquier campaña del usuario)
  - Acción: mostrar toast "🎉 Nuevo participante: [correo]"

Cleanup: supabase.removeChannel(channel) en return del useEffect
```

**Autenticación en API Route de estado:**
La ruta `PATCH /api/campana/[id]/estado` usa el Bearer JWT del header `Authorization`. El cliente envía el token via:
```typescript
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token ?? ''
fetch('/api/campana/[id]/estado', {
  headers: { Authorization: `Bearer ${token}` }
})
```

**Colores de empresa en el dashboard (cero tokens):**
Los colores `color_primario` y `color_secundario` de la tabla `empresas` se aplican via inline styles en:
- Avatar del navbar: `style={{ background: linear-gradient(135deg, color_primario, #A855F7) }}`
- Botón "Nueva campaña" en `DashboardHeader`: `style={{ background: linear-gradient(135deg, color_primario, #A855F7) }}`
- Iconos en `MetricasCards`: el color de la card de campañas activas usa `color_primario`

**Export CSV — sin librerías externas:**
```typescript
const csv = [headers, ...filas].join('\n')
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.download = `${slug}-participantes.csv`
a.click()
URL.revokeObjectURL(url)
```

---

### Flujo de prueba completo

1. **Login** con empresa existente → redirige a `/dashboard`
2. **Dashboard** → skeleton loading → métricas animan desde 0 → lista de campañas
3. **Nueva campaña** → botón en header → `/chat` → wizard → lanzar → aparece en tabla
4. **Pausar campaña** → DropdownMenu → "Pausar" → badge cambia a naranja instantáneamente
5. **Ver QR** → DropdownMenu → "Ver QR" → modal con QR grande → descargar PNG
6. **Ver métricas detalladas** → "Ver métricas" → `/dashboard/campana/[id]` → distribución de premios
7. **Exportar CSV** → botón "Exportar CSV" → descarga `[slug]-participantes.csv`
8. **Realtime** → abre dashboard + abre campaign page en otra tab → participa → toast aparece sin recargar
9. **Configuración** → avatar → Configuración → cambiar colores → preview en tiempo real → guardar

---

### Tareas pendientes actualizadas

- [x] ~~Dashboard completo con métricas en tiempo real~~ ✓ Completado
- [x] ~~Métricas detalladas por campaña~~ ✓ Completado
- [x] ~~Exportar participantes CSV~~ ✓ Completado
- [x] ~~Configuración de empresa (colores, datos, plan)~~ ✓ Completado
- [x] ~~QR modal con descarga PNG~~ ✓ Completado
- [x] ~~Panel de configuración de empresa~~ ✓ Completado
- [ ] **Alta prioridad**: Crear tabla `puntos_participantes` en Supabase para el módulo de puntos
- [ ] **Media prioridad**: Integrar OCR real con Google Cloud Vision API en `/api/procesar-factura`
- [ ] **Media prioridad**: Integrar bots de WhatsApp y Telegram
- [ ] **Media prioridad**: Sistema de notificaciones (email al ganar un premio)
- [ ] **Baja prioridad**: Páginas `/terminos`, `/privacidad`
- [ ] **Baja prioridad**: API pública para integraciones

---

*Actualización agregada el 20 de marzo de 2026 — Módulo 6.*

---

## Módulo 7 — Bot de Telegram, OCR de Facturas, Notificaciones por Correo, Demos y Páginas Legales

### Fecha: 20 de marzo de 2026

---

### Resumen del módulo

Se implementaron los módulos críticos finales del MVP: el bot de Telegram para interacción conversacional, OCR real de facturas con Tesseract.js, notificaciones automáticas por correo con Resend, los 3 demos pre-cargados con su página pública, y las páginas legales de términos y privacidad. También se actualizaron el footer y el navbar con links reales a todas las secciones.

---

### Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `lib/ocr.ts` | Motor de OCR con Tesseract.js para facturas (spa+eng) |
| `lib/email.ts` | Notificaciones con Resend: `enviarCodigoPremio` y `enviarBienvenida` |
| `lib/seed-demos.ts` | Script para cargar los 3 demos en Supabase (`npm run seed`) |
| `bot/telegram.ts` | Bot de Telegram con polling: /start, /campanas, /puntos, /canjear, /ayuda, fotos |
| `app/demos/page.tsx` | Página pública `/demos` con los 3 casos de uso interactivos |
| `app/terminos/page.tsx` | Términos de Servicio |
| `app/privacidad/page.tsx` | Política de Privacidad (con ancla `#cookies`) |

---

### Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `app/api/procesar-factura/route.ts` | Reemplazado placeholder por OCR real con `procesarFacturaConOCR()` |
| `app/api/girar-ruleta/route.ts` | Agrega envío de correo con `enviarCodigoPremio()` tras giro exitoso |
| `app/api/generar-codigo/route.ts` | Agrega envío de correo con `enviarCodigoPremio()` tras generar cupón |
| `components/Footer.tsx` | Links reales: /demos, /precios, /guia, /validar, /terminos, /privacidad |
| `components/Navbar.tsx` | "Casos de uso" → "Demos" apuntando a `/demos` |
| `components/CTAFinal.tsx` | Botón "Ver una demo" apunta a `/demos` |
| `.env.local` | Agregadas: `TELEGRAM_BOT_TOKEN`, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL` |
| `package.json` | Scripts: `bot`, `bot:dev`, `seed` |

---

### SQL nuevo para Supabase

```sql
-- Tabla de puntos por participante
CREATE TABLE IF NOT EXISTS puntos_participantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participante_id UUID NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
  campana_id UUID NOT NULL REFERENCES campanas(id),
  total_puntos INTEGER DEFAULT 0,
  ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participante_id, campana_id)
);
ALTER TABLE puntos_participantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insercion puntos" ON puntos_participantes FOR INSERT WITH CHECK (true);
CREATE POLICY "Lectura puntos" ON puntos_participantes FOR SELECT USING (true);
CREATE POLICY "Update puntos" ON puntos_participantes FOR UPDATE USING (true);

-- Tabla para usuarios del bot de Telegram
CREATE TABLE IF NOT EXISTS telegram_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT,
  nombre TEXT,
  campana_id UUID REFERENCES campanas(id),
  participante_id UUID REFERENCES participantes(id),
  ultimo_mensaje TIMESTAMPTZ DEFAULT NOW(),
  creado_en TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_telegram_id ON telegram_usuarios(telegram_id);
ALTER TABLE telegram_usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura telegram" ON telegram_usuarios FOR SELECT USING (true);
CREATE POLICY "Insercion telegram" ON telegram_usuarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Update telegram" ON telegram_usuarios FOR UPDATE USING (true);

-- Tabla para log de notificaciones enviadas
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participante_id UUID REFERENCES participantes(id),
  campana_id UUID REFERENCES campanas(id),
  tipo TEXT CHECK (tipo IN ('premio_ganado','recordatorio','bienvenida')),
  enviado_a TEXT NOT NULL,
  enviado_en TIMESTAMPTZ DEFAULT NOW(),
  exitoso BOOLEAN DEFAULT TRUE
);
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insercion notificaciones" ON notificaciones FOR INSERT WITH CHECK (true);
CREATE POLICY "Lectura notificaciones" ON notificaciones FOR SELECT USING (true);
```

---

### Detalles técnicos

**OCR con Tesseract.js (`lib/ocr.ts`):**
- Crea worker con idiomas `spa+eng` para facturas latinoamericanas
- Extrae número de factura con 3 patrones regex en cascada (fallback a timestamp único)
- Extrae monto con 3 patrones: total/amount/monto, símbolos $ y Q (quetzales)
- Verifica que la factura no haya sido procesada antes (anti-duplicados via tabla `notificaciones`)
- UPSERT en `puntos_participantes` — suma o crea el registro
- Primer análisis: 10-15s (descarga modelos ~40MB). Siguientes: 3-5s
- Timeout extendido a 60s en el API route con `export const maxDuration = 60`

**Notificaciones con Resend (`lib/email.ts`):**
- `enviarCodigoPremio()`: HTML con gradiente FREEPOL, código en font-mono con borde punteado, fecha de expiración
- `enviarBienvenida()`: Botón CTA directo a la URL de la campaña
- `fromEmail`: `onboarding@resend.dev` en desarrollo, `premios@freepol.app` en producción
- Si Resend falla: `console.error` + devuelve `false` — **nunca interrumpe el flujo principal**
- Ambas rutas (`/api/girar-ruleta`, `/api/generar-codigo`) llaman al envío como fire-and-forget con `.catch()`

**Bot de Telegram (`bot/telegram.ts`):**
- Modo **polling** para desarrollo local; en producción usar webhook
- Comandos: `/start`, `/campanas`, `/puntos`, `/canjear`, `/ayuda`
- Callbacks inline para selección de campaña
- Procesamiento de fotos: descarga la imagen más grande del mensaje y llama a `procesarFacturaConOCR()`
- Al /canjear exitoso: genera QR con `qrcode.toBuffer()` y envía con `bot.sendPhoto()`
- Antifraude: Redis key `tg:[campana_id]:[telegram_id]` para evitar doble participación

**Página de demos (`app/demos/page.tsx`):**
- Tema claro como la landing
- 3 cards con colores corporativos reales (Pollo Campero #E8000D, Walmart #0071CE, McDonald's #FFC72C)
- Prompt original de cada demo en recuadro tipo terminal
- Botones: "Probar demo" → `/c/[slug]`, "Crear campaña similar" → `/chat`

**Script seed (`lib/seed-demos.ts`):**
- Verifica existencia por `slug` antes de insertar
- Usa `SUPABASE_SERVICE_ROLE_KEY` para saltarse RLS
- Ejecutar: `npm run seed`

---

### Comandos de prueba

```bash
# 1. Iniciar el servidor Next.js
npm run dev

# 2. Cargar los 3 demos en Supabase (una sola vez)
npm run seed

# 3. Iniciar el bot de Telegram (requiere TELEGRAM_BOT_TOKEN)
npm run bot

# 4. Ver demos en vivo
open http://localhost:3000/demos

# 5. Páginas legales
open http://localhost:3000/terminos
open http://localhost:3000/privacidad
```

---

### Pendientes actualizados tras el Módulo 7

- [x] ~~Tabla `puntos_participantes`~~ ✓
- [x] ~~Bot de Telegram~~ ✓
- [x] ~~OCR de facturas (Tesseract.js)~~ ✓
- [x] ~~Notificaciones por correo (Resend)~~ ✓
- [x] ~~Página /demos con los 3 demos~~ ✓
- [x] ~~`/terminos` y `/privacidad`~~ ✓
- [x] ~~Footer con links reales~~ ✓
- [x] ~~Script `npm run seed`~~ ✓
- [ ] Tabla `telegram_usuarios` — correr SQL en Supabase
- [ ] Tabla `notificaciones` — correr SQL en Supabase
- [ ] Verificar token de Telegram en `.env.local`
- [ ] Verificar API key de Resend en `.env.local`
- [ ] Activar webhook de Telegram en producción
- [ ] Verificar dominio `freepol.app` en Resend dashboard
- [ ] Bot de WhatsApp Business (solo plan Pro+)
- [ ] Bot de Instagram (solo plan Pro+)
- [ ] Google Cloud Vision API para OCR de alta precisión en producción
- [ ] `/dashboard/equipo` — gestión de miembros
- [ ] `/api/campana/[id]/duplicar` — duplicar campaña
- [ ] `app/not-found.tsx` — página 404 personalizada
- [ ] `sitemap.xml` y `robots.txt`

---

*Actualización agregada el 20 de marzo de 2026 — Módulo 7.*

### Fecha: 20 de marzo de 2026

Esta sección recoge **todos** los ítems pendientes detectados tras revisar el proyecto completo, organizados por prioridad y módulo. Se irán marcando como completados a medida que se implementen.

---

### Pendientes de infraestructura / Supabase

- [x] ~~Tabla `campanas`~~ ✓
- [x] ~~Tabla `participantes`~~ ✓
- [x] ~~Tabla `codigos`~~ ✓
- [x] ~~Tabla `empresas`~~ ✓
- [x] ~~Tabla `empresa_miembros`~~ ✓
- [x] ~~Tabla `campana_aliados`~~ ✓
- [x] ~~**Tabla `puntos_participantes`**~~ ✓ SQL listo en Módulo 7
- [x] ~~**Tabla `telegram_usuarios`**~~ ✓ SQL listo en Módulo 7
- [x] ~~**Tabla `notificaciones`**~~ ✓ SQL listo en Módulo 7
- [ ] **Tabla `facturas`** — para evitar doble procesamiento de OCR (número de factura único por campaña)
- [ ] Habilitar Supabase Realtime en las tablas `campanas` y `participantes` desde el dashboard de Supabase (Publication → supabase_realtime)
- [ ] Configurar Supabase Auth con "Email confirmation" habilitado en producción

---

### Pendientes de Backend / API Routes

- [x] ~~`/api/analizar-prompt`~~ ✓
- [x] ~~`/api/girar-ruleta`~~ ✓
- [x] ~~`/api/generar-codigo`~~ ✓
- [x] ~~`/api/registrar-participante`~~ ✓
- [x] ~~`/api/validar-codigo`~~ ✓
- [x] ~~`/api/procesar-factura` (placeholder)~~ ✓ placeholder
- [x] ~~`/api/generar-mensaje`~~ ✓
- [x] ~~`/api/crear-campana`~~ ✓
- [x] ~~`/api/campana/[id]/estado`~~ ✓
- [x] ~~**`/api/procesar-factura` con OCR real**~~ ✓ Tesseract.js integrado
- [ ] **`/api/telegram-webhook`** — endpoint POST para recibir mensajes del bot en producción (Vercel no soporta polling)
- [ ] **`/api/send-email`** (opcional wrapper) — centralizar envío de correos
- [ ] **`/api/campana/[id]/duplicar`** — duplicar campaña como borrador (mencionado en `ListaCampanas.tsx` pero no implementado)

---

### Pendientes de Frontend / Páginas

- [x] ~~Landing `/`~~ ✓
- [x] ~~Chat `/chat`~~ ✓
- [x] ~~Wizard `/wizard`~~ ✓
- [x] ~~Landing pública `/c/[slug]`~~ ✓
- [x] ~~Validar código `/validar`~~ ✓
- [x] ~~Onboarding `/onboarding`~~ ✓
- [x] ~~Dashboard `/dashboard`~~ ✓
- [x] ~~Métricas campaña `/dashboard/campana/[id]`~~ ✓
- [x] ~~Configuración `/dashboard/config`~~ ✓
- [x] ~~Guía `/guia`~~ ✓
- [x] ~~Precios `/precios`~~ ✓
- [x] ~~Alianza `/alianza/[token]`~~ ✓
- [x] ~~**`/demos`**~~ ✓ Página con los 3 demos pre-cargados
- [x] ~~**`/terminos`**~~ ✓ Términos de Servicio
- [x] ~~**`/privacidad`**~~ ✓ Política de Privacidad
- [ ] **`/dashboard/equipo`** — gestión de miembros del equipo (mencionado en dropdown del dashboard pero placeholder)
- [ ] **`/dashboard/facturacion`** — gestión del plan y facturación
- [ ] **Paso `Paso8bAliado`** integrado al wizard — actualmente existe el componente pero no está conectado en `app/wizard/page.tsx`
- [ ] **`app/api/campana/[id]/duplicar`** + botón en dashboard

---

### Pendientes de Integraciones externas

- [ ] **Bot de Telegram** (`bot/telegram.ts`) — bot con polling para desarrollo, webhook para producción
- [ ] **OCR real con Tesseract.js** (`lib/ocr.ts`) — reemplazar placeholder en `/api/procesar-factura`
- [ ] **Notificaciones por correo con Resend** (`lib/email.ts`) — correo al ganar un premio y bienvenida
- [ ] **Bot de WhatsApp** — requiere WhatsApp Business API (solo plan Pro+)
- [ ] **Bot de Instagram** — respuesta automática a comentarios (solo plan Pro+)
- [ ] **Google Cloud Vision API** — OCR de alta precisión en producción (reemplazar Tesseract.js)

---

### Pendientes de datos / Seeds

- [x] ~~**`lib/seed-demos.ts`**~~ ✓ Script `npm run seed` listo
- [ ] Correr `npm run seed` en el entorno de staging antes del lanzamiento

---

### Pendientes de seguridad y producción

- [ ] Verificar dominio `freepol.app` en Resend para enviar correos reales
- [ ] Activar webhook de Telegram: `POST https://api.telegram.org/bot[TOKEN]/setWebhook`
- [ ] Configurar variables de entorno en Vercel: `TELEGRAM_BOT_TOKEN`, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`
- [ ] Habilitar `actualizado_en` trigger en Supabase para `empresas` (actualiza automáticamente)
- [ ] Rate limiting en `/api/procesar-factura` (OCR es costoso en CPU)
- [ ] CORS y headers de seguridad en `next.config.js`
- [ ] `HASH_SECRET` en producción debe ser una clave de mínimo 32 caracteres aleatoria

---

### Pendientes de UX / polish

- [ ] Estados de error globales en las páginas públicas de campaña (`/c/[slug]`) cuando las APIs fallan
- [ ] Página 404 personalizada (`app/not-found.tsx`) con branding FREEPOL
- [ ] Página de mantenimiento cuando Supabase está caído
- [ ] `og:image` dinámica por campaña en `/c/[slug]` (actualmente solo texto)
- [ ] `sitemap.xml` y `robots.txt` para SEO
- [ ] `app/loading.tsx` global con skeleton consistente
- [ ] Animación de transición entre páginas (actualmente cada página carga independiente)
- [ ] Modo oscuro completo en páginas públicas (actualmente solo chat y wizard son oscuros)
- [ ] Componente `ComponenteRuleta.tsx` — la animación de giro necesita calibración más precisa del ángulo final
- [ ] `Paso8bAliado.tsx` — los datos guardados en `localStorage('freepol_aliado')` no se consumen en `Paso10Resumen.tsx` para insertar en `campana_aliados`

---

### Variables de entorno faltantes

Las siguientes deben agregarse a `.env.local` y a Vercel:

```
TELEGRAM_BOT_TOKEN=obtener de @BotFather en Telegram
RESEND_API_KEY=obtener de resend.com (gratis hasta 3,000/mes)
NEXT_PUBLIC_APP_URL=http://localhost:3000 (o dominio en producción)
```

---

## Módulo 8 — Pulido y Producción: Middleware, SEO, 404, Loading, Vercel

### Fecha: 20 de marzo de 2026

---

### Resumen del módulo

Módulo final de pulido que prepara el proyecto para despliegue en producción. Se implementó el middleware de autenticación con `@supabase/ssr`, páginas de estado (404 personalizada, loading global y específicos), mejoras de SEO en el layout raíz, layout aislado para landings de campaña, detección de parámetros URL en el chat, integración del flujo Demo→Chat con prompts pre-cargados, configuración de Vercel, y scripts de verificación y semilla.

---

### Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `middleware.ts` | Protege `/dashboard` y `/onboarding` con sesión Supabase SSR |
| `app/not-found.tsx` | Página 404 con tema oscuro, número animado y botones de navegación |
| `app/loading.tsx` | Loading global con logo FREEPOL y barra de progreso animada |
| `app/dashboard/loading.tsx` | Skeleton completo del dashboard (navbar + métricas + tabla) |
| `app/chat/loading.tsx` | Skeleton del chat con sidebar y ícono Sparkles pulsante |
| `app/c/[slug]/layout.tsx` | Layout override que aísla las landings de campaña del navbar global |
| `vercel.json` | Configuración de Vercel con timeouts extendidos para OCR y IA |
| `.env.example` | Plantilla de variables de entorno para nuevos desarrolladores |
| `scripts/verificar-proyecto.ts` | Script de verificación completa (`npm run verificar`) |

---

### Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `app/layout.tsx` | Metadatos OG completos con template de título, locale es_GT, og-image.png |
| `lib/supabase-server.ts` | Refactorizado con `@supabase/ssr` + cookies correctas de Next.js App Router |
| `app/chat/page.tsx` | Detecta `?auth=required` (abre AuthDialog) y `?prompt=` (pre-carga textarea) |
| `app/demos/page.tsx` | Botones "Ver en el chat" pasan `promptChat` como `?prompt=` en la URL |
| `next.config.js` | Agrega `*.supabase.co` en remotePatterns y Tesseract.js en serverExternalPackages |
| `package.json` | Script `npm run verificar` agregado |

---

### Flujo de conexión Demo → Chat (cero tokens extra)

```
Usuario en /demos
    ↓ clic "Ver en el chat →"
/chat?prompt=Configura+la+campaña...
    ↓ useSearchParams detecta el parámetro
setInputValue(decodeURIComponent(prompt))
    ↓ toast "Prompt cargado desde demos ✨"
Textarea pre-llenado — usuario solo hace clic en Enviar
```

---

### Flujo del middleware

```
GET /dashboard (sin sesión)
    ↓ middleware.ts
supabase.auth.getSession() → null
    ↓
redirect(/?auth=required)
    ↓ app/chat/page.tsx (si se va a /chat) o app/page.tsx
Si /?auth=required: setAuthOpen(true) + toast "Inicia sesión..."
```

---

### Comandos para presentar el proyecto

```bash
# 1. Cargar los 3 demos en Supabase
npm run seed

# 2. Verificar que todo está configurado
npm run verificar

# 3. Iniciar el servidor Next.js
npm run dev

# 4. (Opcional) Iniciar el bot de Telegram
npm run bot
```

---

### Checklist de 10 puntos pre-presentación

- [ ] `npm run seed` ejecutado correctamente (3 demos ✅)
- [ ] `npm run verificar` sin ❌ en variables requeridas y tablas
- [ ] `/c/sabor-ganador-campero` carga y la ruleta gira
- [ ] `/c/eco-puntos-walmart-puma` carga con formulario de teléfono
- [ ] `/c/cupones-flash-mcdonalds` carga y genera código
- [ ] `/validar` valida un código existente correctamente
- [ ] `/chat` analiza un prompt y redirige al wizard
- [ ] `/wizard` pre-llenado desde localStorage tras análisis
- [ ] `/dashboard` requiere login (middleware redirige a `/?auth=required`)
- [ ] `/demos` muestra las 3 cards y botones "Ver en el chat" pre-cargan prompts

---

### Deploy a Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (primera vez — configura el proyecto)
vercel

# 4. Configurar variables de entorno en Vercel dashboard:
#    Settings → Environment Variables → agregar todas las de .env.example

# 5. Deploy a producción
vercel --prod
```

Variables de entorno que DEBES agregar en Vercel antes del deploy:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `HASH_SECRET`
- `NEXT_PUBLIC_APP_URL` (el dominio de Vercel, ej: `https://freepol.vercel.app`)
- `RESEND_API_KEY` (opcional pero recomendado)
- `TELEGRAM_BOT_TOKEN` (opcional — el bot necesita webhook en producción)

---

### Pendientes actualizados tras el Módulo 8

- [x] ~~Middleware de autenticación~~ ✓
- [x] ~~Página 404 personalizada~~ ✓
- [x] ~~Loading pages globales y específicos~~ ✓
- [x] ~~Layout aislado para `/c/[slug]`~~ ✓
- [x] ~~SEO completo en `app/layout.tsx`~~ ✓
- [x] ~~`vercel.json` configurado~~ ✓
- [x] ~~`.env.example` creado~~ ✓
- [x] ~~`npm run verificar` (script de verificación)~~ ✓
- [x] ~~Flujo Demo → Chat con prompts pre-cargados~~ ✓
- [ ] Crear imagen `public/og-image.png` (1200×630px) para Open Graph
- [ ] Bot de Telegram en producción: activar webhook en Vercel
  - `POST https://api.telegram.org/bot[TOKEN]/setWebhook?url=https://tudominio.vercel.app/api/telegram-webhook`
- [ ] Verificar dominio `freepol.app` en Resend dashboard para correos reales
- [ ] `sitemap.xml` y `robots.txt` para SEO avanzado
- [ ] `/dashboard/equipo` — gestión de miembros del equipo
- [ ] `/api/campana/[id]/duplicar` — duplicar campaña

---

*Actualización agregada el 20 de marzo de 2026 — Módulo 8 (Final).*

---

## Módulo 9 — Deploy a Vercel en Producción

### Fecha: 23 de marzo de 2026

---

### Resumen del módulo

Se realizó el despliegue completo del proyecto a Vercel. Se corrigió el warning de `metadataBase` en `app/layout.tsx` para que Open Graph funcione correctamente en producción. Se configuraron las 9 variables de entorno requeridas en el panel de Vercel y se realizaron 2 deploys (el primero con las 4 variables ya existentes de un deploy previo, el segundo con las 5 variables faltantes para que el build las incluya).

---

### URLs de producción

| URL | Descripción |
|-----|-------------|
| **https://freepol.vercel.app** | URL principal de producción |
| https://freepol-1ck2552s8-astral910s-projects.vercel.app | URL del último deploy específico |
| https://vercel.com/astral910s-projects/freepol | Panel de Vercel del proyecto |

---

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `app/layout.tsx` | Agregado `metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://freepol.app')` para resolver warning de OG images |

---

### Variables de entorno configuradas en Vercel

Todas las variables están configuradas en los entornos **Development, Preview y Production**:

| Variable | Estado |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Configurada |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Configurada |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Configurada |
| `GROQ_API_KEY` | ✅ Configurada |
| `UPSTASH_REDIS_REST_URL` | ✅ Configurada |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ Configurada |
| `HASH_SECRET` | ✅ Configurada |
| `RESEND_API_KEY` | ✅ Configurada |
| `NEXT_PUBLIC_APP_URL` | ✅ Configurada (`https://freepol.vercel.app`) |

---

### Pendientes post-deploy

- [ ] **Actualizar Supabase Auth** → Settings → URL Configuration → agregar `https://freepol.vercel.app` como Site URL y Redirect URL
- [ ] **Correr `npm run seed`** apuntando a producción para cargar los 3 demos en la BD
- [ ] **Telegram webhook en producción**: `POST https://api.telegram.org/bot[TOKEN]/setWebhook?url=https://freepol.vercel.app/api/telegram-webhook`
- [ ] **Verificar dominio** `freepol.app` en Resend para correos con remitente real
- [ ] **Agregar dominio personalizado** en Vercel → Settings → Domains (si se tiene `freepol.app`)
- [ ] Crear imagen `public/og-image.png` (1200×630px) para Open Graph en redes sociales

---

*Actualización agregada el 23 de marzo de 2026 — Módulo 9 (Deploy a Vercel).*

---

## Módulo 10 — Integración WhatsApp con Twilio Sandbox

### Fecha: 23 de marzo de 2026

---

### Resumen del módulo

Se integró WhatsApp Business mediante Twilio Sandbox. El sistema ahora envía notificaciones automáticas por WhatsApp cuando un participante gana un premio (junto al correo ya existente), y también incluye un bot conversacional que responde a mensajes entrantes. Las variables de Twilio fueron agregadas a Vercel y el deploy fue ejecutado exitosamente.

---

### Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `lib/whatsapp.ts` | Cliente Twilio con 3 funciones: `enviarMensajeWhatsApp`, `enviarCodigoPorWhatsApp`, `enviarBienvenidaWhatsApp`. Normaliza automáticamente números al formato `whatsapp:+502XXXXXXXX` |
| `app/api/whatsapp-webhook/route.ts` | Bot conversacional que Twilio llama cuando alguien escribe al sandbox. Maneja: saludos, ver puntos, canjear, selección de campaña por número. Responde con TwiML |
| `app/api/test-whatsapp/route.ts` | Endpoint GET solo en desarrollo: `?telefono=50249135546` envía un mensaje de prueba para verificar Twilio |

---

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `app/api/girar-ruleta/route.ts` | Tras generar el código: si el participante tiene teléfono, llama `enviarCodigoPorWhatsApp()` como fire-and-forget |
| `app/api/generar-codigo/route.ts` | Misma lógica que girar-ruleta para cupones directos |
| `app/api/registrar-participante/route.ts` | Si `condicion === 'telefono'` y el participante tiene teléfono, envía mensaje de bienvenida con `enviarBienvenidaWhatsApp()` |
| `components/campana/LandingCampana.tsx` | Agrega nota `"📱 Te enviaremos tu código por WhatsApp al ganar"` debajo del input de teléfono |

---

### Variables de entorno configuradas

| Variable | Valor | Dónde |
|----------|-------|-------|
| `TWILIO_ACCOUNT_SID` | `AC51d0c...` | `.env.local` + Vercel |
| `TWILIO_AUTH_TOKEN` | `68c2e6...` | `.env.local` + Vercel |
| `TWILIO_WHATSAPP_NUMBER` | `whatsapp:+14155238886` | `.env.local` + Vercel |

---

### Cómo funciona el bot (webhook)

```
Usuario escribe en WhatsApp → Twilio → POST /api/whatsapp-webhook

Comandos reconocidos:
  "hola" / "inicio" / "start"  → Lista de campañas activas
  "mis puntos" / "saldo"        → Saldo de puntos del usuario
  "canjear"                     → Genera código si tiene suficientes puntos
  "1" / "2" / "3"               → Selecciona y se registra en esa campaña
  (cualquier otro)              → Mensaje de ayuda con comandos
```

---

### Cómo configurar el webhook en Twilio

**Para producción (ya deployado):**
1. Ir a [twilio.com/console](https://twilio.com/console)
2. Messaging → Settings → WhatsApp Sandbox Settings
3. En "When a message comes in" poner:
   `https://freepol.vercel.app/api/whatsapp-webhook`
4. Método: HTTP POST → Guardar

**Para desarrollo local con ngrok:**
```bash
# Terminal 1: servidor Next.js
npm run dev

# Terminal 2: túnel ngrok
npx ngrok http 3000
# Copiar la URL https://xxxx.ngrok.io
# Ponerla en Twilio como: https://xxxx.ngrok.io/api/whatsapp-webhook
```

---

### Cómo probar

**1. Probar envío directo (desarrollo):**
```
GET http://localhost:3000/api/test-whatsapp?telefono=50249135546
```
Debe llegar un mensaje de prueba al WhatsApp.

**2. Probar el bot:**
- Unirse al Sandbox: enviar `join [palabra]` al +14155238886
- Escribir `hola` → debe responder con campañas
- Escribir `1` → debe registrarte en la primera campaña
- Escribir `mis puntos` → debe mostrar saldo

**3. Probar flujo completo:**
- Crear campaña con condición `telefono` en /wizard
- Ir a /c/[slug] → ingresar número de teléfono → debe llegar bienvenida por WhatsApp
- Si es tipo ruleta: girar → debe llegar el código por WhatsApp

---

### Flujo de notificaciones por canal

| Evento | Correo | WhatsApp |
|--------|--------|----------|
| Registro con teléfono | ✗ | ✅ Bienvenida |
| Registro con correo | ✅ (Resend) | ✗ |
| Premio ganado (teléfono) | ✗ | ✅ Código + instrucciones |
| Premio ganado (correo) | ✅ Código HTML | ✗ |
| Canje por bot | ✗ | ✅ Código inline |

---

### Pendientes post-integración

- [ ] **Configurar webhook en Twilio Sandbox** → URL: `https://freepol.vercel.app/api/whatsapp-webhook`
- [ ] Unirse al sandbox enviando `join [palabra-clave]` al +14155238886 para probar
- [ ] En producción real: migrar de Sandbox a WhatsApp Business API aprobada (solo plan Pro+)
- [ ] Agregar `ngrok` como dependencia de desarrollo para pruebas locales del webhook

---

*Actualización agregada el 23 de marzo de 2026 — Módulo 10 (WhatsApp con Twilio).*

---

## Módulo 11 — Chat con sesión obligatoria, planes en onboarding y precios (marzo 2026)

### Objetivo

- Garantizar que solo usuarios autenticados con empresa (flujo completo) envíen prompts a la IA y generen configuración enlazable a `creado_por` en campañas.
- Permitir a visitantes ver sugerencias y guía de prompts sin consumir flujo de guardado inconsistente.
- Persistir el **plan** elegido en `empresas.plan` sin lógica de pagos reales.
- Alinear la página **Precios** con el onboarding y el dashboard.

### Git / despliegue

- **Rama:** cambios en `develop`, merge a `main`.
- **Commits relevantes en `main`:**
  - `424d789` — `feat(auth): gate AI chat behind session, add plan selection to onboarding`
  - `844dd73` — merge de `develop` → `main`
- **Push:** `origin/main` y `origin/develop` actualizados en el remoto configurado del proyecto.
- **Vercel:** al estar el proyecto conectado al repo, un push a `main` dispara build y deploy; la URL de producción (p. ej. `freepol.vercel.app`) refleja estos cambios tras el deploy exitoso.

### Cambios en código (archivos)

| Archivo | Cambio |
|---------|--------|
| `app/chat/page.tsx` | Estado `sessionCargada`; si no hay empresa (sin sesión o sin onboarding), `enviarMensaje` abre `AuthDialog` y muestra toast; sidebar botón “Iniciar sesión…” abre el dialog; `ChatInput` recibe `sinSesion` y `onLoginClick`. |
| `components/chat/ChatInput.tsx` | Props `sinSesion`, `onLoginClick`; banner con candado + CTA; textarea y envío bloqueados sin sesión; botón circular abre login si aplica; footer distinto para visitante. |
| `app/onboarding/page.tsx` | Flujo de **4 pasos** (empresa/industria → marca → **elección de plan** → confirmación); lectura de `?plan=` desde URL; `crearEmpresa` con `plan`; pantalla final muestra plan activado. |
| `lib/empresa.ts` | Tipo `Empresa.plan` incluye `'starter'`; `crearEmpresa` acepta `plan?: string` e inserta `plan` (default `'free'`). |
| `app/precios/page.tsx` | Botones por plan con `handleElegirPlan`: sin sesión → `/onboarding?plan=id`; con sesión sin empresa → mismo; con empresa → `actualizarEmpresa` y `router.push('/dashboard?plan_actualizado=1')`; Enterprise → `mailto:ventas@freepol.app`. |
| `scripts/seed-empresas.ts` | Seed con service role: 4 empresas demo + varias campañas (sin `owner_id` obligatorio en filas demo; `creado_por` opcional). |
| `package.json` | Script `seed:empresas` → `ts-node --esm scripts/seed-empresas.ts`. |

### SQL manual en Supabase (no olvidar)

El plan **Starter** debe existir en el `CHECK` de la tabla `empresas` si la base aún solo permite `free | pro | enterprise`:

```sql
ALTER TABLE empresas DROP CONSTRAINT IF EXISTS empresas_plan_check;
ALTER TABLE empresas ADD CONSTRAINT empresas_plan_check
  CHECK (plan IN ('free', 'starter', 'pro', 'enterprise'));
```

*(Ajustar el nombre del constraint si en tu proyecto difiere.)*

### Script de empresas de prueba

- Comando: `npm run seed:empresas`
- Requiere `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
- Empresas insertadas (ejemplo de nombres): Pollo Campero Guatemala, Walmart Guatemala, McDonald's Guatemala, Taquería Don Chema — con campañas asociadas y slugs únicos generados.

### Comportamiento esperado (QA)

1. **Visitante en `/chat`:** ve sugerencias y guía; no puede enviar prompt; banner + login.
2. **Usuario logueado con empresa:** envía prompt, flujo IA → wizard → `crear-campana` con JWT → `creado_por` correcto (ver módulo dashboard previo).
3. **Nuevo usuario:** registro → onboarding → elige plan → empresa creada con `plan` en BD.
4. **`/precios`:** elige plan según estado de sesión/empresa como en la tabla anterior.

### Pendientes / mejoras futuras (opcional)

- [ ] Toast o banner en `/dashboard` cuando `?plan_actualizado=1`
- [ ] Restringir `/wizard` con middleware o redirección si no hay sesión (actualmente el chat ya evita generar config sin login si no envían prompt; el wizard podría abrirse por URL con datos viejos en `localStorage` — evaluar hardening)
- [ ] Documentar en README el `seed:empresas` y el SQL del plan `starter`

### Actualización de commits (post Módulo 11 inicial)

| Commit (aprox.) | Mensaje |
|-----------------|--------|
| `cab0188` | `fix(auth): reset verify screen on dialog close, improve signup/login flow` |
| `8a96386` | `feat(scripts): add seed-usuarios-demo for auth users, empresas and campanas` |
| `bd24df0` | `Merge develop: seed usuarios demo` → **main** |

**Ramas:** tras el merge, `main` incluye `develop` hasta el seed de usuarios; conviene ejecutar `git checkout develop && git merge main` periódicamente para alinear `develop` con el último merge en `main`.

---

## Módulo 12 — AuthDialog (verificación de correo) y seed de usuarios reales (marzo 2026)

### Problema resuelto

- Tras registrarse, la pantalla **“Revisa tu correo”** quedaba activa (`registerSuccess === true`) aunque el usuario **cerrara** el modal; al volver a abrirlo no aparecían las pestañas Iniciar sesión / Registrarse.
- Errores de login (p. ej. correo no confirmado) no tenían forma rápida de ocultar el aviso.

### Cambios en `components/AuthDialog.tsx`

| Cambio | Descripción |
|--------|-------------|
| `handleDialogOpenChange` | Al **cerrar** el diálogo: `registerSuccess = false`, reset de countdown y `registeredEmail`, luego `onOpenChange`. El `Dialog` usa este handler en lugar de `onOpenChange` directo del padre. |
| `salirDePantallaVerificacion` | Botones **Ir a iniciar sesión** (rellena correo en el formulario) y **Registrar otro correo** (reset del formulario de registro). |
| `signUp` | Si Supabase devuelve **sesión inmediata** (`signupData.session` — confirmación de correo desactivada en el proyecto), cierra modal y redirige a `/onboarding` o `/dashboard` según empresa. |
| `emailRedirectTo` | `origin + '/'` para enlaces de confirmación correctos según el dominio de la app. |
| Login exitoso | Usa `handleDialogOpenChange(false)` para limpiar estado al cerrar. |
| Mensaje de error en login | Enlace **“Cerrar este mensaje”** que limpia `loginError`. |
| Texto UX | Nota de que cerrar la ventana también permite volver a entrar o registrarse. |

### Nota de configuración Supabase

- En **Authentication → Providers → Email**, si **“Confirm email”** está desactivado, el registro entra al flujo con sesión inmediata (útil en local).
- Si está activado, el usuario debe usar el enlace del correo; la UI ya no bloquea el acceso a login/registro tras cerrar el modal o usar los botones de la pantalla de verificación.

---

## Módulo 13 — Script `seed-usuarios-demo` (Auth Admin + empresas + campañas)

### Objetivo

Crear **cuentas reales** en `auth.users` (correo + contraseña, correo **confirmado** por API admin), una **empresa** por usuario (`empresas.owner_id`), fila en **`empresa_miembros`** (rol `admin`) y **una campaña activa** por usuario con **`creado_por`** = UUID del usuario — para probar dashboard, login y landings con datos coherentes.

### Archivos y comandos

| Elemento | Detalle |
|----------|---------|
| Script | `scripts/seed-usuarios-demo.ts` |
| Comando | `npm run seed:usuarios-demo` |
| Variables | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (**JWT `eyJ...`**, no URL `postgresql://`) |
| Opcional | `SEED_DEMO_USER_PASSWORD` en `.env.local`; si no existe, el script usa una contraseña por defecto documentada **solo en la salida de consola** al ejecutar el comando |
| `package.json` | Script `seed:usuarios-demo` |
| `.env.example` | Comentario para `SEED_DEMO_USER_PASSWORD`; placeholder `RESEND_API_KEY=re_xxx` (no secretos reales) |

### Cuentas demo (correos fijos en el script)

Los correos están definidos en el array `CUENTAS` del script (sufijo `@freepol-demo.local`):

- `demo.pollo@freepol-demo.local` — empresa/campaña tipo **ruleta**
- `demo.retail@freepol-demo.local` — **puntos**
- `demo.cupon@freepol-demo.local` — **cupón**
- `demo.factura@freepol-demo.local` — **factura** (condición teléfono en config)

**Contraseñas:** no se escriben en este documento por política de seguridad. Ejecutar `npm run seed:usuarios-demo` y copiar la contraseña impresa en terminal, o definir `SEED_DEMO_USER_PASSWORD` antes de correr el script.

### Idempotencia

- Si el usuario ya existe (mismo correo), se reutiliza su `id`.
- Si ya existe empresa para `owner_id` o campaña con mismo `nombre_campana` y `creado_por`, el script omite duplicados y muestra mensaje en consola.

### URLs de landings en consola

Tras un fix del script, las URLs de ejemplo usan **`NEXT_PUBLIC_APP_URL`** (p. ej. `http://localhost:3000` o la URL de Vercel), no la URL del host de Supabase.

### Seguridad

- Borrar o rotar contraseñas de estas cuentas en entornos expuestos.
- En Supabase → **Authentication → Users** se pueden eliminar usuarios demo cuando ya no se necesiten.

---

## Estado Git / merge (referencia)

- **Flujo habitual:** desarrollo en `develop` → merge a `main` → push → deploy Vercel.
- **Últimas incorporaciones en `main` (orden lógico):** corrección `creado_por` en campañas, WhatsApp Twilio, SEO `metadataBase`, ESLint/Supabase server para build, MVP merge, chat con sesión + onboarding 4 pasos + precios, fix AuthDialog, script `seed-usuarios-demo` y merge correspondiente.

---

*Actualización agregada — Módulos 11 (ampliado), 12 (AuthDialog) y 13 (seed usuarios demo). Suma al registro de auditoría sin invalidar secciones anteriores.*
