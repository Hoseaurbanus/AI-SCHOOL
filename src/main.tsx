import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ClerkProvider } from "@clerk/clerk-react"
import { ToastProvider } from "./components/ui/Toast"
import App from "./App"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser")
    return worker.start({ onUnhandledRequest: "bypass" })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ClerkProvider publishableKey={clerkPubKey}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <App />
            </ToastProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </ClerkProvider>
    </StrictMode>,
  )
})
