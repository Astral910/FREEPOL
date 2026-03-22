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

*Documento generado el 20 de marzo de 2026. NO incluir en commits — borrar manualmente antes de terminar el proyecto.*
