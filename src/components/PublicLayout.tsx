import { useState } from "react"
import { Menu, X, Zap } from "lucide-react"
import type { Page, UserRole } from "../types"

interface Props {
  children: React.ReactNode
  navigate: (p: Page) => void
  currentPage: Page
  userRole: UserRole
}

const navLinks: { label: string page: Page }[] = [
  { label: "Courses", page: "marketplace" },
  { label: "About", page: "about" },
  { label: "Contact", page: "contact" },
]

export default function PublicLayout({
  children,
  navigate,
  currentPage,
  userRole,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: "#060A12" }}>
      <nav
        className="fixed top-0 left-0 right-0 z-50 glass border-b"
        style={{ borderColor: "rgba(59,130,246,0.1)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("landing")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-blue-purple">
                <Zap size={16} className="text-white" />
              </div>
              <span
                className="text-lg font-bold font-display"
                style={{ color: "#F1F5F9" }}
              >
                Smugflex<span className="gradient-text"> AI</span>
              </span>
            </button>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => navigate(link.page)}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: currentPage === link.page ? "#3B82F6" : "#94A3B8",
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("login")}
                className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                style={{ color: "#94A3B8" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F1F5F9")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
              >
                Log in
              </button>
              <button
                onClick={() => navigate("register")}
                className="text-sm font-semibold px-5 py-2 rounded-lg gradient-blue-purple text-white transition-all hover:opacity-90 hover:shadow-lg"
                style={{ boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
              >
                Get Started
              </button>
            </div>

            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: "#94A3B8" }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            className="md:hidden border-t px-4 py-4 space-y-2"
            style={{
              borderColor: "rgba(59,130,246,0.1)",
              background: "#0D1421",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  navigate(link.page)
                  setMobileOpen(false)
                }}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "#94A3B8", background: "transparent" }}
              >
                {link.label}
              </button>
            ))}
            <div
              className="pt-2 border-t flex flex-col gap-2"
              style={{ borderColor: "rgba(59,130,246,0.1)" }}
            >
              <button
                onClick={() => {
                  navigate("login")
                  setMobileOpen(false)
                }}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium border text-center"
                style={{
                  borderColor: "rgba(59,130,246,0.2)",
                  color: "#94A3B8",
                }}
              >
                Log in
              </button>
              <button
                onClick={() => {
                  navigate("register")
                  setMobileOpen(false)
                }}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white gradient-blue-purple"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">{children}</main>

      <footer
        style={{
          background: "#060A12",
          borderTop: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <button
                onClick={() => navigate("landing")}
                className="flex items-center gap-2 mb-4"
              >
                <div className="w-8 h-8 rounded-lg gradient-blue-purple flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span
                  className="font-bold text-lg font-display"
                  style={{ color: "#F1F5F9" }}
                >
                  Smugflex<span className="gradient-text"> AI</span>
                </span>
              </button>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#475569" }}
              >
                Next-generation AI-powered learning platform helping students
                across Africa build future-ready skills.
              </p>
            </div>
            <div>
              <h4
                className="text-sm font-semibold mb-4"
                style={{ color: "#F1F5F9" }}
              >
                Platform
              </h4>
              <ul className="space-y-2.5">
                {["Courses", "AI Tutor", "Coding Lab", "Certificates"].map(
                  (item) => (
                    <li key={item}>
                      <button
                        className="text-sm transition-colors"
                        style={{ color: "#475569" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#94A3B8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#475569")
                        }
                      >
                        {item}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h4
                className="text-sm font-semibold mb-4"
                style={{ color: "#F1F5F9" }}
              >
                Company
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About Us", page: "about" as Page },
                  { label: "Contact", page: "contact" as Page },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.page)}
                      className="text-sm transition-colors"
                      style={{ color: "#475569" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#94A3B8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#475569")
                      }
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="text-sm font-semibold mb-4"
                style={{ color: "#F1F5F9" }}
              >
                Contact
              </h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "#475569" }}>
                <li>support@smugflex.ai</li>
                <li>+234 901 234 5678</li>
                <li>Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          <div
            className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs"
            style={{
              borderTop: "1px solid rgba(59,130,246,0.08)",
              color: "#475569",
            }}
          >
            <p>© 2025 Smugflex AI Academy. All rights reserved.</p>
            <div className="flex gap-4">
              <button className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-blue-400 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
