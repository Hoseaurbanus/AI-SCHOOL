import { useState, Component, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Brain, Mail, Lock, Eye, EyeOff } from "lucide-react"

type AuthMode = "login" | "register" | "forgot"

interface Props {
  mode: AuthMode
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clerkEnabled = !!clerkPubKey && clerkPubKey !== "pk_test_your_key_here"

class ClerkErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

export default function Auth({ mode }: Props) {
  if (!clerkEnabled) {
    return <CustomAuth mode={mode} />
  }

  const customForm = <CustomAuth mode={mode} />

  return (
    <ClerkErrorBoundary fallback={customForm}>
      <ClerkAuth mode={mode} />
    </ClerkErrorBoundary>
  )
}

function ClerkAuth({ mode }: { mode: AuthMode }) {
  const [SignIn, setSignIn] = useState<React.ComponentType<Record<string, unknown>> | null>(null)
  const [SignUp, setSignUp] = useState<React.ComponentType<Record<string, unknown>> | null>(null)

  useState(() => {
    import("@clerk/clerk-react").then((mod) => {
      setSignIn(() => mod.SignIn)
      setSignUp(() => mod.SignUp)
    }).catch(() => {})
  })

  const appearance = {
    elements: {
      rootBox: "w-full",
      card: "bg-transparent shadow-none",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      socialButtonsBlockButton: "w-full py-3 rounded-xl font-semibold text-sm transition-all",
      formButtonPrimary: "w-full py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white hover:opacity-90",
      formFieldInput: "w-full px-4 py-3 rounded-xl text-sm outline-none",
      footerActionLink: "text-sm font-semibold",
    },
  }

  if (!SignIn && !SignUp) {
    return <CustomAuth mode={mode} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mesh-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-blue-purple">
              <Brain size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">Smugflex AI</span>
          </Link>
          <h1 className="text-2xl font-bold font-display" style={{ color: "#F1F5F9" }}>
            {mode === "login" && "Welcome back"}
            {mode === "register" && "Create your account"}
            {mode === "forgot" && "Reset your password"}
          </h1>
          <p className="text-sm mt-2" style={{ color: "#64748B" }}>
            {mode === "login" && "Sign in to continue your learning journey"}
            {mode === "register" && "Start your AI-powered learning journey today"}
            {mode === "forgot" && "Enter your email to receive a reset link"}
          </p>
        </div>
        <div className="p-8 rounded-2xl" style={{ background: "#0D1421", border: "1px solid rgba(59,130,246,0.1)" }}>
          {mode === "login" && SignIn && <SignIn routing="hash" appearance={appearance} />}
          {mode === "register" && SignUp && <SignUp routing="hash" appearance={appearance} />}
          {mode === "forgot" && SignIn && <SignIn routing="hash" appearance={appearance} />}
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: "#64748B" }}>
              {mode === "login" && <>Don&apos;t have an account? <Link to="/register" className="font-semibold" style={{ color: "#3B82F6" }}>Sign up</Link></>}
              {mode === "register" && <>Already have an account? <Link to="/login" className="font-semibold" style={{ color: "#3B82F6" }}>Sign in</Link></>}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomAuth({ mode }: { mode: AuthMode }) {
  const [authMode, setAuthMode] = useState<AuthMode>(mode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("Authentication is not fully configured yet. Please contact support.")
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mesh-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-blue-purple">
              <Brain size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">Smugflex AI</span>
          </Link>
          <h1 className="text-2xl font-bold font-display" style={{ color: "#F1F5F9" }}>
            {authMode === "login" && "Welcome back"}
            {authMode === "register" && "Create your account"}
            {authMode === "forgot" && "Reset your password"}
          </h1>
          <p className="text-sm mt-2" style={{ color: "#64748B" }}>
            {authMode === "login" && "Sign in to continue your learning journey"}
            {authMode === "register" && "Start your AI-powered learning journey today"}
            {authMode === "forgot" && "Enter your email to receive a reset link"}
          </p>
        </div>
        <div className="p-8 rounded-2xl" style={{ background: "#0D1421", border: "1px solid rgba(59,130,246,0.1)" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {authMode === "register" && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#94A3B8" }}>Full Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                  style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", color: "#F1F5F9" }}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94A3B8" }}>Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#64748B" }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                  style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", color: "#F1F5F9" }}
                  required
                />
              </div>
            </div>
            {authMode !== "forgot" && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#94A3B8" }}>Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#64748B" }} />
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", color: "#F1F5F9" }}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "#64748B" }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
            {error && <p className="text-sm" style={{ color: "#EF4444" }}>{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Please wait..." : authMode === "login" ? "Sign In" : authMode === "register" ? "Create Account" : "Send Reset Link"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: "#64748B" }}>
              {authMode === "login" && <>Don&apos;t have an account? <button onClick={() => setAuthMode("register")} className="font-semibold" style={{ color: "#3B82F6" }}>Sign up</button></>}
              {authMode === "register" && <>Already have an account? <button onClick={() => setAuthMode("login")} className="font-semibold" style={{ color: "#3B82F6" }}>Sign in</button></>}
              {authMode === "forgot" && <>Remember your password? <button onClick={() => setAuthMode("login")} className="font-semibold" style={{ color: "#3B82F6" }}>Sign in</button></>}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
