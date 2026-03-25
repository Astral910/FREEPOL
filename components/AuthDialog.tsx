'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, CheckCircle, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase'
import { getEmpresaDelUsuario } from '@/lib/empresa'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'login' | 'register'
}

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

interface RegisterForm {
  company: string
  fullName: string
  email: string
  password: string
  confirmPassword: string
  sitioWeb?: string
  terms: boolean
}

/**
 * Desarrollo: en Supabase → Authentication → Providers → Email,
 * puedes desactivar "Confirm email" para entrar al instante tras registrarse
 * (útil en local). En producción suele dejarse activado.
 */

/**
 * Verifica los requisitos de contraseña en tiempo real.
 */
function checkPasswordRequirements(password: string) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
}

/**
 * Límite de correos / peticiones en el signUp público de Supabase.
 * En ese caso intentamos POST /api/auth/registro-directo (solo si el servidor lo permite).
 */
function esErrorRateLimitRegistro(error: { message: string; status?: number }): boolean {
  const m = error.message.toLowerCase()
  if (error.status === 429) return true
  if (m.includes('rate limit')) return true
  if (m.includes('too many requests')) return true
  if (m.includes('email rate limit')) return true
  if (m.includes('over_email_send_rate_limit')) return true
  if (m.includes('email_send_rate_limit')) return true
  return false
}

/** Mensajes claros para errores de supabase.auth.signUp */
function mapRegisterError(error: { message: string }): string {
  const m = error.message.toLowerCase()
  if (m.includes('already registered') || m.includes('user already registered')) {
    return 'Este correo ya está registrado. ¿Quieres iniciar sesión?'
  }
  if (esErrorRateLimitRegistro(error)) {
    return 'Demasiados intentos de registro por correo. Espera unos minutos e inténtalo de nuevo.'
  }
  if (m.includes('password') && m.includes('weak')) {
    return 'La contraseña es demasiado débil. Usa mayúsculas, números y un carácter especial.'
  }
  if (m.includes('invalid email')) {
    return 'El formato del correo no es válido.'
  }
  return 'No se pudo completar el registro. Verifica los datos e intenta de nuevo.'
}

/** Tras registro-directo + signIn, si el login falla */
function mapSignInErrorDespuesRegistroDirecto(error: { message: string }): string {
  const m = error.message.toLowerCase()
  if (m.includes('email not confirmed') || m.includes('email_not_confirmed')) {
    return 'La cuenta se creó pero falta confirmación de correo. Revisa tu bandeja o inicia sesión en unos segundos.'
  }
  if (m.includes('invalid login') || m.includes('invalid_credentials')) {
    return 'No se pudo iniciar sesión automáticamente. Usa «Iniciar sesión» con el mismo correo y contraseña.'
  }
  return 'Cuenta procesada, pero el inicio de sesión automático falló. Prueba iniciar sesión manualmente.'
}

/**
 * Modal de autenticación con tabs de login y registro.
 * Usa Supabase Auth para login/signup.
 */
export default function AuthDialog({ open, onOpenChange, defaultTab = 'login' }: AuthDialogProps) {
  const router = useRouter()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const [watchedPassword, setWatchedPassword] = useState('')

  const loginForm = useForm<LoginForm>({ defaultValues: { remember: false } })
  const registerForm = useForm<RegisterForm>({ defaultValues: { terms: false } })

  // Sincronizar el tab con la prop defaultTab cuando el dialog se abre
  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab)
      setLoginError('')
      setRegisterError('')
    }
  }, [open, defaultTab])

  /**
   * Al cerrar el modal: limpiar pantalla de "revisa tu correo" para que
   * la próxima vez puedan iniciar sesión o registrarse sin quedar bloqueados.
   */
  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      setRegisterSuccess(false)
      setResendCountdown(0)
      setRegisteredEmail('')
    }
    onOpenChange(next)
  }

  /** Salir de la pantalla de verificación y volver a login / registro */
  const salirDePantallaVerificacion = (destino: 'login' | 'register') => {
    const correo = registeredEmail
    setRegisterSuccess(false)
    setResendCountdown(0)
    setActiveTab(destino)
    if (destino === 'login' && correo) {
      loginForm.setValue('email', correo)
    }
    if (destino === 'register') {
      registerForm.reset({ terms: false })
    }
    setRegisteredEmail('')
  }

  // Countdown para reenvío de correo
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const handleLogin = async (data: LoginForm) => {
    setLoginLoading(true)
    setLoginError('')
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) {
        const errMsg = error.message.toLowerCase()
        if (errMsg.includes('invalid login credentials') || errMsg.includes('invalid_credentials')) {
          setLoginError('Correo o contraseña incorrectos. Intenta de nuevo.')
        } else if (
          errMsg.includes('email not confirmed') ||
          errMsg.includes('email_not_confirmed')
        ) {
          setLoginError(
            'Activa tu cuenta con el enlace que enviamos a tu correo y vuelve a intentar. Si ya lo hiciste, espera un momento e intenta otra vez.',
          )
        } else if (errMsg.includes('too many requests')) {
          setLoginError('Demasiados intentos. Espera unos minutos.')
        } else {
          setLoginError('Ocurrió un error inesperado. Intenta de nuevo.')
        }
      } else if (authData.user) {
        handleDialogOpenChange(false)
        // Verificar si ya tiene empresa → dashboard, si no → onboarding
        const empresa = await getEmpresaDelUsuario(authData.user.id)
        router.push(empresa ? '/dashboard' : '/onboarding')
      }
    } catch {
      setLoginError('Ocurrió un error inesperado. Intenta de nuevo.')
    } finally {
      setLoginLoading(false)
    }
  }

  /** Guarda datos para onboarding y redirige igual que un registro exitoso con sesión */
  const completarRegistroTrasSesion = async (userId: string, data: RegisterForm) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'freepol_registro',
        JSON.stringify({
          nombre_empresa: data.company,
          nombre_completo: data.fullName,
          sitio_web: data.sitioWeb ?? '',
        }),
      )
    }
    handleDialogOpenChange(false)
    const empresa = await getEmpresaDelUsuario(userId)
    router.push(empresa ? '/dashboard' : '/onboarding')
  }

  const handleRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError('confirmPassword', { message: 'Las contraseñas no coinciden' })
      return
    }
    setRegisterLoading(true)
    setRegisterError('')
    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL ?? ''

      const { data: signupData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          // Tras confirmar correo, Supabase redirige aquí (ajusta dominios en Supabase → URL config)
          emailRedirectTo: origin ? `${origin}/` : undefined,
          data: {
            full_name: data.fullName,
            company_name: data.company,
          },
        },
      })

      if (error) {
        // Fallback: límite de envío de email en Supabase → Admin API (solo si ALLOW_DIRECT_SIGNUP=true)
        if (esErrorRateLimitRegistro(error)) {
          const res = await fetch('/api/auth/registro-directo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
              fullName: data.fullName,
              company: data.company,
            }),
          })
          const json = (await res.json()) as { ok?: boolean; error?: string }

          if (res.status === 201 && json.ok === true) {
            const { error: signInErr, data: signInData } = await supabase.auth.signInWithPassword({
              email: data.email,
              password: data.password,
            })
            if (signInErr || !signInData.user) {
              setRegisterError(
                signInErr
                  ? mapSignInErrorDespuesRegistroDirecto(signInErr)
                  : 'Cuenta creada pero no se pudo iniciar sesión. Usa «Iniciar sesión».',
              )
              return
            }
            await completarRegistroTrasSesion(signInData.user.id, data)
            return
          }

          if (res.status === 403) {
            setRegisterError(
              'Hay demasiados registros por correo ahora. Espera unos minutos. (El registro alternativo no está activo en este servidor.)',
            )
            return
          }
          if (res.status === 409) {
            setRegisterError('Este correo ya está registrado. ¿Quieres iniciar sesión?')
            return
          }
          setRegisterError(json.error ?? 'No se pudo registrar con el método alternativo.')
          return
        }

        setRegisterError(mapRegisterError(error))
        return
      }

      if (signupData.session && signupData.user) {
        await completarRegistroTrasSesion(signupData.user.id, data)
        return
      }

      // Requiere abrir el enlace del correo
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'freepol_registro',
          JSON.stringify({
            nombre_empresa: data.company,
            nombre_completo: data.fullName,
            sitio_web: data.sitioWeb ?? '',
          }),
        )
      }
      setRegisteredEmail(data.email)
      setRegisterSuccess(true)
      setResendCountdown(60)
    } catch {
      setRegisterError('Ocurrió un error inesperado. Intenta de nuevo.')
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleResend = useCallback(async () => {
    if (resendCountdown > 0) return
    await supabase.auth.resend({ type: 'signup', email: registeredEmail })
    setResendCountdown(60)
  }, [resendCountdown, registeredEmail, supabase.auth])

  const pwdReqs = checkPasswordRequirements(watchedPassword)
  const pwdScore = Object.values(pwdReqs).filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        overlayClassName="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        className="max-w-md overflow-hidden rounded-3xl border border-[#E8344E]/30 bg-[#0A0A0A] p-0 text-white shadow-2xl [&>button.absolute]:text-white [&>button.absolute]:hover:bg-white/10"
        aria-labelledby="auth-dialog-title"
      >
        <DialogTitle className="sr-only" id="auth-dialog-title">
          Acceso a FREEPOL
        </DialogTitle>
        <DialogDescription className="sr-only">
          Inicia sesión o crea una cuenta nueva en FREEPOL
        </DialogDescription>

        {registerSuccess ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8344E]/40" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#E8344E]/20">
                <Mail size={36} className="text-[#E8344E]" />
              </div>
            </div>
            <h2 className="text-3xl font-black uppercase text-white">Revisa tu correo</h2>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              Enviamos un enlace a{' '}
              <span className="font-semibold text-white">{registeredEmail}</span>. Haz clic para
              activar tu cuenta y luego inicia sesión aquí.
            </p>
            {resendCountdown > 0 && (
              <p className="text-lg font-black text-[#E8344E]">
                Reenvío disponible en {resendCountdown}s
              </p>
            )}
            <Button
              variant="outline"
              className="mt-1 w-full max-w-xs border-white/20 bg-transparent text-white hover:bg-white/10"
              onClick={handleResend}
              disabled={resendCountdown > 0}
            >
              {resendCountdown > 0
                ? `Reenviar correo en ${resendCountdown}s`
                : 'Reenviar correo'}
            </Button>
            <div className="flex w-full max-w-xs flex-col gap-2 pt-2">
              <Button
                type="button"
                className="w-full bg-[#E8344E] font-bold text-white hover:brightness-110"
                onClick={() => salirDePantallaVerificacion('login')}
              >
                Ir a iniciar sesión
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-white/25 bg-transparent text-white hover:bg-white/10"
                onClick={() => salirDePantallaVerificacion('register')}
              >
                Registrar otro correo
              </Button>
            </div>
            <p className="max-w-xs text-xs text-[#64748B]">
              Si cierras esta ventana también podrás entrar o registrarte de nuevo; este aviso no te
              bloquea.
            </p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-8 pb-4 pt-8 text-center">
              <div className="mb-4 flex justify-center">
                <img
                  src="/Letras_efecto_fondo_negro.png"
                  alt="FREEPOL"
                  width={140}
                  height={36}
                  className="h-9 w-auto mix-blend-screen"
                />
              </div>
              <h2 className="mb-1 text-3xl font-black uppercase text-white">Empieza gratis</h2>
              <p className="mb-6 text-sm text-[#94A3B8]">Tu primera campaña en 5 minutos</p>
              <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xl bg-white/10 p-1">
                <TabsTrigger
                  value="login"
                  className="flex-1 rounded-lg font-bold text-[#94A3B8] transition-all data-[state=active]:bg-[#E8344E] data-[state=active]:text-white data-[state=inactive]:hover:text-white"
                >
                  Iniciar sesión
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="flex-1 rounded-lg font-bold text-[#94A3B8] transition-all data-[state=active]:bg-[#E8344E] data-[state=active]:text-white data-[state=inactive]:hover:text-white"
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Login */}
            <TabsContent value="login" className="mt-0 px-8 pb-8">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-[#94A3B8]">
                    Correo corporativo
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="empresa@correo.com"
                    aria-label="Correo corporativo"
                    className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-[#64748B] focus-visible:border-[#E8344E] focus-visible:ring-[#E8344E]/30"
                    {...loginForm.register('email', { required: true })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="login-password" className="text-[#94A3B8]">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      aria-label="Contraseña"
                      className="rounded-xl border-white/10 bg-white/5 pr-10 text-white placeholder:text-[#64748B] focus-visible:border-[#E8344E] focus-visible:ring-[#E8344E]/30"
                      {...loginForm.register('password', { required: true })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-white"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-white/5 text-[#E8344E]"
                      {...loginForm.register('remember')}
                    />
                    <span className="text-sm text-[#94A3B8]">Recordarme</span>
                  </label>
                  <button type="button" className="text-sm text-[#E8344E] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {loginError && (
                  <div className="space-y-2 rounded-lg border border-red-500/40 bg-red-950/50 p-3 text-sm text-red-200">
                    <p>{loginError}</p>
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#F2839A] hover:underline"
                      onClick={() => setLoginError('')}
                    >
                      Cerrar este mensaje
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-auto w-full rounded-xl bg-[#E8344E] py-4 text-xl font-black text-white hover:scale-[1.02] hover:brightness-110"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </Button>

                <div className="relative flex items-center gap-3">
                  <Separator className="flex-1 bg-white/10" />
                  <span className="whitespace-nowrap text-xs text-[#64748B]">o</span>
                  <Separator className="flex-1 bg-white/10" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="flex w-full items-center gap-3 rounded-lg border-white/15 bg-transparent text-white hover:bg-white/10"
                >
                  {/* SVG ícono de Google */}
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continuar con Google
                </Button>
              </form>
            </TabsContent>

            {/* Tab Registro */}
            <TabsContent value="register" className="mt-0 px-8 pb-8">
              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <Badge variant="green" className="flex items-center gap-1 border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]">
                    <CheckCircle size={12} />
                    Sin tarjeta de crédito
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-company" className="text-[#94A3B8]">
                    Nombre de tu empresa
                  </Label>
                  <Input
                    id="reg-company"
                    placeholder="Mi Empresa S.A."
                    aria-label="Nombre de la empresa"
                    className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-[#64748B] focus-visible:border-[#E8344E] focus-visible:ring-[#E8344E]/30"
                    {...registerForm.register('company', {
                      required: 'Requerido',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    })}
                  />
                  {registerForm.formState.errors.company && (
                    <p className="text-xs text-red-500">
                      {registerForm.formState.errors.company.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-name" className="text-[#94A3B8]">
                    Tu nombre completo
                  </Label>
                  <Input
                    id="reg-name"
                    placeholder="Juan Pérez"
                    aria-label="Nombre completo"
                    className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-[#64748B] focus-visible:border-[#E8344E] focus-visible:ring-[#E8344E]/30"
                    {...registerForm.register('fullName', { required: 'Requerido' })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-email" className="text-[#94A3B8]">
                    Correo corporativo
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="empresa@correo.com"
                    aria-label="Correo corporativo"
                    className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-[#64748B] focus-visible:border-[#E8344E] focus-visible:ring-[#E8344E]/30"
                    {...registerForm.register('email', {
                      required: 'Requerido',
                      pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' },
                    })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-password" className="text-[#94A3B8]">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      aria-label="Contraseña"
                      className="rounded-xl border-white/10 bg-white/5 pr-10 text-white placeholder:text-[#64748B] focus-visible:border-[#E8344E] focus-visible:ring-[#E8344E]/30"
                      {...registerForm.register('password', {
                        required: 'Requerido',
                        onChange: (e) => setWatchedPassword(e.target.value),
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          i < pwdScore
                            ? pwdScore >= 4
                              ? 'bg-[#22C55E]'
                              : pwdScore >= 2
                                ? 'bg-[#EAB308]'
                                : 'bg-[#E8344E]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-2 space-y-1">
                    {[
                      { key: 'length', label: '8 caracteres mínimo' },
                      { key: 'uppercase', label: 'Una mayúscula' },
                      { key: 'number', label: 'Un número' },
                      { key: 'special', label: 'Un carácter especial' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        <Check
                          size={12}
                          className={
                            pwdReqs[key as keyof typeof pwdReqs]
                              ? 'text-[#22C55E]'
                              : 'text-[#CBD5E1]'
                          }
                        />
                        <span
                          className={`text-xs ${
                            pwdReqs[key as keyof typeof pwdReqs]
                              ? 'text-[#22C55E]'
                              : 'text-[#94A3B8]'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm" className="text-[#94A3B8]">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      aria-label="Confirmar contraseña"
                      className="rounded-xl border-white/10 bg-white/5 pr-10 text-white placeholder:text-[#64748B] focus-visible:border-[#E8344E] focus-visible:ring-[#E8344E]/30"
                      {...registerForm.register('confirmPassword', { required: 'Requerido' })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                      aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <label className="flex cursor-pointer items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-white/20 bg-white/5"
                    {...registerForm.register('terms', { required: true })}
                  />
                  <span className="text-xs leading-relaxed text-[#94A3B8]">
                    Acepto los{' '}
                    <a href="/terminos" className="text-[#E8344E] hover:underline">
                      Términos de servicio
                    </a>{' '}
                    y la{' '}
                    <a href="/privacidad" className="text-[#E8344E] hover:underline">
                      Política de privacidad
                    </a>
                  </span>
                </label>

                {registerError && (
                  <div className="rounded-lg border border-red-500/40 bg-red-950/50 p-3 text-sm text-red-200">
                    {registerError}
                    {registerError.includes('ya está registrado') && (
                      <button
                        type="button"
                        className="ml-2 text-[#F2839A] hover:underline"
                        onClick={() => setActiveTab('login')}
                      >
                        Ir a login
                      </button>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-auto w-full rounded-xl bg-[#E8344E] py-4 text-xl font-black text-white hover:scale-[1.02] hover:brightness-110"
                  disabled={registerLoading}
                >
                  {registerLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta gratuita'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
