import { create } from 'zustand'
import type { ConfigCampana } from '@/types/campana'

/** Clave de localStorage donde se guarda la config generada por Groq */
const LS_KEY = 'freepol_config'

/** Config por defecto para el wizard cuando no hay datos previos */
const CONFIG_DEFAULT: ConfigCampana = {
  nombre_negocio: '',
  nombre_campana: '',
  tipo: 'ruleta',
  canal: 'whatsapp',
  condicion: 'correo',
  premios: [
    { nombre: '', probabilidad: 50 },
    { nombre: '', probabilidad: 50 },
  ],
  puntos_por_monto: null,
  monto_base: null,
  meta_canje: null,
  frecuencia: '1_dia',
  fecha_inicio: new Date().toISOString().split('T')[0],
  fecha_fin: '',
  horario_inicio: null,
  horario_fin: null,
  dias_activos: null,
  mensaje_bienvenida: '',
  limite_participantes: null,
  deep_link_url: null,
  horas_expiracion_codigo: 48,
}

interface WizardStore {
  paso: number
  totalPasos: number
  config: ConfigCampana
  errores: Record<string, string>
  guardando: boolean
  completado: boolean
  hayDatos: boolean

  // Navegación
  setPaso: (paso: number) => void
  siguientePaso: () => void
  anteriorPaso: () => void

  // Configuración
  setConfig: <K extends keyof ConfigCampana>(campo: K, valor: ConfigCampana[K]) => void
  setConfigCompleta: (config: ConfigCampana) => void

  // Errores
  setError: (campo: string, mensaje: string) => void
  limpiarError: (campo: string) => void
  limpiarErrores: () => void

  // Estado general
  setGuardando: (valor: boolean) => void
  setCompletado: (valor: boolean) => void
  resetWizard: () => void

  // Persistencia
  cargarDesdeLocalStorage: () => void
}

export const useWizardStore = create<WizardStore>((set, get) => ({
  paso: 1,
  totalPasos: 10,
  config: { ...CONFIG_DEFAULT },
  errores: {},
  guardando: false,
  completado: false,
  hayDatos: false,

  setPaso: (paso) => set({ paso }),

  siguientePaso: () => {
    const { paso, totalPasos } = get()
    if (paso < totalPasos) set({ paso: paso + 1 })
  },

  anteriorPaso: () => {
    const { paso } = get()
    if (paso > 1) set({ paso: paso - 1 })
  },

  setConfig: (campo, valor) =>
    set((state) => ({
      config: { ...state.config, [campo]: valor },
    })),

  setConfigCompleta: (config) =>
    set({
      config: { ...CONFIG_DEFAULT, ...config },
      hayDatos: true,
    }),

  setError: (campo, mensaje) =>
    set((state) => ({
      errores: { ...state.errores, [campo]: mensaje },
    })),

  limpiarError: (campo) =>
    set((state) => {
      const nuevos = { ...state.errores }
      delete nuevos[campo]
      return { errores: nuevos }
    }),

  limpiarErrores: () => set({ errores: {} }),

  setGuardando: (valor) => set({ guardando: valor }),

  setCompletado: (valor) => set({ completado: valor }),

  resetWizard: () =>
    set({
      paso: 1,
      config: { ...CONFIG_DEFAULT },
      errores: {},
      guardando: false,
      completado: false,
      hayDatos: false,
    }),

  cargarDesdeLocalStorage: () => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null
      if (!raw) return

      const parsed = JSON.parse(raw) as { config?: ConfigCampana }
      if (parsed?.config) {
        get().setConfigCompleta(parsed.config)
      }
    } catch (e) {
      console.warn('[WizardStore] Error al cargar desde localStorage:', e)
    }
  },
}))
