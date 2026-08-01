export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api"

export const COURSE_CATEGORIES = [
  { value: "programming", label: "Programming", icon: "⟨/⟩", color: "#3B82F6" },
  {
    value: "ai",
    label: "Artificial Intelligence",
    icon: "◈",
    color: "#8B5CF6",
  },
  {
    value: "data_analysis",
    label: "Data Analysis",
    icon: "▦",
    color: "#06B6D4",
  },
  { value: "business", label: "Business Skills", icon: "◉", color: "#F59E0B" },
  {
    value: "academic",
    label: "Academic Learning",
    icon: "⊞",
    color: "#10B981",
  },
] as const

export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const

export const PAYMENT_METHODS = [
  {
    id: "paystack",
    name: "Paystack",
    description: "Pay with card or bank transfer",
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description: "Pay with card, bank, or mobile money",
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    description: "Manual bank transfer (verification required)",
  },
] as const

export const NAVIGATION = {
  student: [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/my-courses", label: "My Courses" },
    { path: "/ai-tutor", label: "AI Tutor" },
    { path: "/coding-lab", label: "Coding Lab" },
    { path: "/certificates", label: "Certificates" },
  ],
  admin: [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/courses", label: "Courses" },
    { path: "/admin/payments", label: "Payments" },
    { path: "/admin/analytics", label: "Analytics" },
  ],
} as const
