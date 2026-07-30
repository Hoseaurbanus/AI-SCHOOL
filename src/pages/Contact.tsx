import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Contact() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={{ background: '#060A12', minHeight: '100vh' }}>
      <section className="py-16 px-6 text-center mesh-bg" style={{ borderBottom: '1px solid rgba(59,130,246,0.08)' }}>
        <h1 className="text-4xl lg:text-5xl font-bold font-display mb-3" style={{ color: '#F1F5F9' }}>
          Get in <span className="gradient-text">touch</span>
        </h1>
        <p className="text-lg" style={{ color: '#64748B' }}>We're here to help with any questions</p>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Contact information</h2>
            {[
              { icon: Mail, label: 'Email', value: 'support@smugflex.ai', detail: 'We respond within 2 hours' },
              { icon: Phone, label: 'Phone', value: '+234 901 234 5678', detail: 'Mon–Fri, 8am–6pm WAT' },
              { icon: MapPin, label: 'Office', value: 'Victoria Island, Lagos', detail: 'Nigeria' },
            ].map(({ icon: Icon, label, value, detail }) => (
              <div key={label} className="flex gap-4 p-4 rounded-xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <Icon size={18} style={{ color: '#3B82F6' }} />
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: '#475569' }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{value}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{detail}</p>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#8B5CF6' }}>Need instant help?</p>
              <p className="text-xs mb-3" style={{ color: '#64748B' }}>Our AI support agent can answer most questions instantly.</p>
              <button
                onClick={() => navigate('/register')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}
              >
                Chat with AI Support
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 lg:p-8 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <CheckCircle size={32} style={{ color: '#10B981' }} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-2" style={{ color: '#F1F5F9' }}>Message sent!</h3>
                  <p className="mb-6" style={{ color: '#64748B' }}>We will get back to you within 2 hours.</p>
                  <button onClick={() => setSent(false)} className="text-sm font-medium" style={{ color: '#3B82F6' }}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>Send us a message</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { id: 'name', label: 'Your Name', placeholder: 'Emeka Okafor' },
                      { id: 'email', label: 'Email Address', placeholder: 'emeka@email.com' },
                    ].map(({ id, label, placeholder }) => (
                      <div key={id}>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>{label}</label>
                        <input
                          type={id === 'email' ? 'email' : 'text'}
                          placeholder={placeholder}
                          value={form[id as keyof typeof form]}
                          onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Subject</label>
                    <input
                      type="text"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us more about your question or issue..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90 transition-all"
                    style={{ boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
                  >
                    <Send size={18} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
