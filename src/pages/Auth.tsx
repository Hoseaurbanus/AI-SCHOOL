import { useState } from "react"
import { Link } from "react-router-dom"
import { SignIn, SignUp } from "@clerk/clerk-react"
import { Brain } from "lucide-react"

type AuthMode = "login" | "register" | "forgot"

interface Props {
  mode: AuthMode
}

export default function Auth({ mode }: Props) {
  const [authMode, setAuthMode] = useState<AuthMode>(mode)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mesh-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-blue-purple">
              <Brain size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">
              Smugflex AI
            </span>
          </Link>
          <h1
            className="text-2xl font-bold font-display"
            style={{ color: "#F1F5F9" }}
          >
            {authMode === "login" && "Welcome back"}
            {authMode === "register" && "Create your account"}
            {authMode === "forgot" && "Reset your password"}
          </h1>
          <p className="text-sm mt-2" style={{ color: "#64748B" }}>
            {authMode === "login" &&
              "Sign in to continue your learning journey"}
            {authMode === "register" &&
              "Start your AI-powered learning journey today"}
            {authMode === "forgot" &&
              "Enter your email to receive a reset link"}
          </p>
        </div>

        <div
          className="p-8 rounded-2xl"
          style={{
            background: "#0D1421",
            border: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          {authMode === "login" && (
            <SignIn
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "w-full py-3 rounded-xl font-semibold text-sm transition-all",
                  formButtonPrimary:
                    "w-full py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white hover:opacity-90",
                  formFieldInput:
                    "w-full px-4 py-3 rounded-xl text-sm outline-none",
                  footerActionLink: "text-sm font-semibold",
                },
              }}
            />
          )}

          {authMode === "register" && (
            <SignUp
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "w-full py-3 rounded-xl font-semibold text-sm transition-all",
                  formButtonPrimary:
                    "w-full py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white hover:opacity-90",
                  formFieldInput:
                    "w-full px-4 py-3 rounded-xl text-sm outline-none",
                  footerActionLink: "text-sm font-semibold",
                },
              }}
            />
          )}

          {authMode === "forgot" && (
            <SignIn
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formButtonPrimary:
                    "w-full py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white hover:opacity-90",
                  formFieldInput:
                    "w-full px-4 py-3 rounded-xl text-sm outline-none",
                  footerActionLink: "text-sm font-semibold",
                },
              }}
            />
          )}

          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: "#64748B" }}>
              {authMode === "login" && (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setAuthMode("register")}
                    className="font-semibold"
                    style={{ color: "#3B82F6" }}
                  >
                    Sign up
                  </button>
                </>
              )}
              {authMode === "register" && (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("login")}
                    className="font-semibold"
                    style={{ color: "#3B82F6" }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
