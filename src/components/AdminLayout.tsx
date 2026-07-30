import { useState } from 'react'
import {
  LayoutDashboard, Users, BookOpen, BarChart3, CreditCard,
  Award, Brain, LogOut, Zap, Menu, X, ChevronRight, Bell, Shield,
} from 'lucide-react'
import type { Page } from '../types'

interface Props {
  children: React.ReactNode
  navigate: (p: Page) => void
  currentPage: Page
  onLogout: () => void
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'admin-dashboard' as Page },
  { icon: Users, label: 'Users', page: 'admin-users' as Page },
  { icon: BookOpen, label: 'Courses', page: 'admin-courses' as Page },
  { icon: BarChart3, label: 'Analytics', page: 'admin-analytics' as Page },
  { icon: CreditCard, label: 'Payments', page: 'admin-payments' as Page },
  { icon: Award, label: 'Certificates', page: 'admin-certificates' as Page },
  { icon: Brain, label: 'AI Knowledge', page: 'admin-ai' as Page },
]

export default function AdminLayout({ children, navigate, currentPage, onLogout }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b" style={{ borderColor: 'rgba(239,68,68,0.1)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#EF4444,#DC2626)' }}>
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-base font-display" style={{ color: '#F1F5F9' }}>
              Smugflex <span style={{ color: '#EF4444' }}>Admin</span>
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#EF4444' }} />
          <span className="text-xs font-medium" style={{ color: '#EF4444' }}>Admin Control Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, page }) => {
          const active = currentPage === page
          return (
            <button
              key={page}
              onClick={() => { navigate(page); setSidebarOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(239,68,68,0.1)' : 'transparent',
                color: active ? '#EF4444' : '#94A3B8',
              }}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{label}</span>
              {active && <ChevronRight size={14} style={{ color: '#EF4444' }} />}
            </button>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t" style={{ borderColor: 'rgba(239,68,68,0.1)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: '#EF4444' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444' }}>
              SA
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#F1F5F9' }}>Super Admin</p>
              <p className="text-xs truncate" style={{ color: '#64748B' }}>admin@smugflex.ai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen" style={{ background: '#060A12' }}>
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r"
        style={{ background: '#0D1421', borderColor: 'rgba(239,68,68,0.1)' }}
      >
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside
            className="relative flex flex-col w-72 border-r z-10"
            style={{ background: '#0D1421', borderColor: 'rgba(239,68,68,0.1)' }}
          >
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color: '#94A3B8' }}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="flex items-center justify-between px-4 sm:px-6 py-4 border-b flex-shrink-0"
          style={{ background: '#0D1421', borderColor: 'rgba(239,68,68,0.1)' }}
        >
          <button className="lg:hidden p-2 rounded-lg" style={{ color: '#94A3B8' }} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-sm font-semibold font-display" style={{ color: '#F1F5F9' }}>Admin Dashboard</h1>
            <p className="text-xs" style={{ color: '#475569' }}>Wednesday, 30 July 2025</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="relative p-2 rounded-lg"
              style={{ color: '#94A3B8' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ background: '#060A12' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
