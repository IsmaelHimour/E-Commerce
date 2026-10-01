import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { registerUser } from '../services/authService'
import { getApiErrorMessage } from '../utils/apiErrors'

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      const message = 'Passwords do not match.'
      setError(message)
      toast.error(message)
      return
    }

    try {
      setIsSubmitting(true)
      const response = await registerUser({ fullName, email, password })
      login(response)
      toast.success(`Welcome to ShopSphere, ${response.user.fullName}.`)
      navigate(from, { replace: true })
    } catch (exception) {
      const message = getApiErrorMessage(exception, 'Unable to create account.')
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Account</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">Register</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
          Create an account for faster checkout, saved order history, and a more personal store experience.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-7"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              Full name
            </label>
            <div className="mt-2 flex items-center gap-3 rounded border border-neutral-300 bg-neutral-50 px-3 dark:border-neutral-700 dark:bg-neutral-950">
              <User size={18} className="text-neutral-500" aria-hidden="true" />
              <input
                id="fullName"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                required
                className="h-12 w-full bg-transparent text-sm outline-none"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              Email
            </label>
            <div className="mt-2 flex items-center gap-3 rounded border border-neutral-300 bg-neutral-50 px-3 dark:border-neutral-700 dark:bg-neutral-950">
              <Mail size={18} className="text-neutral-500" aria-hidden="true" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="h-12 w-full bg-transparent text-sm outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                Password
              </label>
              <div className="mt-2 flex items-center gap-3 rounded border border-neutral-300 bg-neutral-50 px-3 dark:border-neutral-700 dark:bg-neutral-950">
                <Lock size={18} className="text-neutral-500" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="h-12 w-full min-w-0 bg-transparent text-sm outline-none"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="grid size-9 shrink-0 place-items-center rounded text-neutral-600 transition hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100"
              >
                Confirm
              </label>
              <div className="mt-2 flex items-center gap-3 rounded border border-neutral-300 bg-neutral-50 px-3 dark:border-neutral-700 dark:bg-neutral-950">
                <Lock size={18} className="text-neutral-500" aria-hidden="true" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="h-12 w-full min-w-0 bg-transparent text-sm outline-none"
                  placeholder="Confirm"
                />
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition enabled:hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
          Already have an account?{' '}
          <Link
            to="/login"
            state={location.state}
            className="font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
          >
            Sign in
          </Link>
        </p>
      </form>
    </section>
  )
}
