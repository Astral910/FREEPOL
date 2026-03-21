'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, CheckCircle, Zap, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase'

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
  terms: boolean
}

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
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) {
        setLoginError('Correo o contraseña incorrectos. Intenta de nuevo.')
      } else {
        onOpenChange(false)
        router.push('/dashboard')
      }
    } catch {
      setLoginError('Ocurrió un error inesperado. Intenta de nuevo.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError('confirmPassword', { message: 'Las contraseñas no coinciden' })
      return
    }
    setRegisterLoading(true)
    setRegisterError('')
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            company_name: data.company,
          },
        },
      })
      if (error) {
        if (error.message.includes('already registered')) {
          setRegisterError('Este correo ya está registrado.')
        } else {
          setRegisterError(error.message)
        }
      } else {
        setRegisteredEmail(data.email)
        setRegisterSuccess(true)
        setResendCountdown(60)
      }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden" aria-labelledby="auth-dialog-title">
        <DialogTitle className="sr-only" id="auth-dialog-title">
          Acceso a FREEPOL
        </DialogTitle>
        <DialogDescription className="sr-only">
          Inicia sesión o crea una cuenta nueva en FREEPOL
        </DialogDescription>

        {registerSuccess ? (
          /* Pantalla de confirmación de correo */
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center animate-bounce">
              <Mail size={32} className="text-[#22C55E]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F172A]">Revisa tu correo</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Enviamos un enlace a{' '}
              <span className="font-semibold text-[#0F172A]">{registeredEmail}</span>. Haz
              clic para activar tu cuenta.
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={handleResend}
              disabled={resendCountdown > 0}
            >
              {resendCountdown > 0
                ? `Reenviar correo en ${resendCountdown}s`
                : 'Reenviar correo'}
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Header con logo */}
            <div className="px-8 pt-8 pb-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <Zap size={18} className="text-[#5B5CF6]" />
                <span className="text-lg font-bold">
                  <span className="text-[#5B5CF6]">FREE</span>
                  <span className="text-[#0F172A]">POL</span>
                </span>
              </div>
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">
                  Iniciar sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="flex-1">
                  Registrarse
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Login */}
            <TabsContent value="login" className="px-8 pb-8 mt-0">
              <div className="mb-5 text-center">
                <h2 className="text-xl font-bold text-[#0F172A]">Bienvenido de nuevo</h2>
                <p className="text-sm text-[#64748B] mt-1">Ingresa a tu cuenta</p>
              </div>

              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Correo corporativo</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="empresa@correo.com"
                    aria-label="Correo corporativo"
                    {...loginForm.register('email', { required: true })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      aria-label="Contraseña"
                      className="pr-10"
                      {...loginForm.register('password', { required: true })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-[#E5E7EB] text-[#5B5CF6]"
                      {...loginForm.register('remember')}
                    />
                    <span className="text-sm text-[#64748B]">Recordarme</span>
                  </label>
                  <button type="button" className="text-sm text-[#5B5CF6] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {loginError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                    {loginError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#5B5CF6] text-white rounded-lg py-3 h-auto font-semibold hover:brightness-110"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </Button>

                <div className="relative flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-[#94A3B8] whitespace-nowrap">o</span>
                  <Separator className="flex-1" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-lg flex items-center gap-3"
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
            <TabsContent value="register" className="px-8 pb-8 mt-0">
              <div className="mb-5 text-center">
                <h2 className="text-xl font-bold text-[#0F172A]">Crea tu cuenta gratis</h2>
                <div className="flex justify-center mt-2">
                  <Badge variant="green" className="flex items-center gap-1">
                    <CheckCircle size={12} />
                    Sin tarjeta de crédito
                  </Badge>
                </div>
              </div>

              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="reg-company">Nombre de tu empresa</Label>
                  <Input
                    id="reg-company"
                    placeholder="Mi Empresa S.A."
                    aria-label="Nombre de la empresa"
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
                  <Label htmlFor="reg-name">Tu nombre completo</Label>
                  <Input
                    id="reg-name"
                    placeholder="Juan Pérez"
                    aria-label="Nombre completo"
                    {...registerForm.register('fullName', { required: 'Requerido' })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-email">Correo corporativo</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="empresa@correo.com"
                    aria-label="Correo corporativo"
                    {...registerForm.register('email', {
                      required: 'Requerido',
                      pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' },
                    })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      aria-label="Contraseña"
                      className="pr-10"
                      {...registerForm.register('password', {
                        required: 'Requerido',
                        onChange: (e) => setWatchedPassword(e.target.value),
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Indicador de fortaleza */}
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
                  <Label htmlFor="reg-confirm">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="reg-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      aria-label="Confirmar contraseña"
                      className="pr-10"
                      {...registerForm.register('confirmPassword', { required: 'Requerido' })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
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

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-[#E5E7EB]"
                    {...registerForm.register('terms', { required: true })}
                  />
                  <span className="text-xs text-[#64748B] leading-relaxed">
                    Acepto los{' '}
                    <a href="/terms" className="text-[#5B5CF6] hover:underline">
                      Términos de servicio
                    </a>{' '}
                    y la{' '}
                    <a href="/privacy" className="text-[#5B5CF6] hover:underline">
                      Política de Privacidad
                    </a>
                  </span>
                </label>

                {registerError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                    {registerError}
                    {registerError.includes('ya está registrado') && (
                      <button
                        type="button"
                        className="ml-2 text-[#5B5CF6] hover:underline"
                        onClick={() => setActiveTab('login')}
                      >
                        Ir a login
                      </button>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#5B5CF6] text-white rounded-lg py-3 h-auto font-semibold hover:brightness-110"
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
