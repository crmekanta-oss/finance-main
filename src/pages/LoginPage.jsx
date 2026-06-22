import { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock, User, Shield, BarChart2, Crown, ArrowRight, CheckCircle } from 'lucide-react'
import { supabase, isConfigured } from '../lib/supabase'

const ROLES = [
  { key:'admin',     label:'Admin',     Icon:Shield,    color:'#3b82f6', desc:'Operations · Sales · Inventory · Payments' },
  { key:'marketing', label:'Marketing', Icon:BarChart2, color:'#f97316', desc:'Campaigns · ROAS · ROI Analytics' },
  { key:'ceo',       label:'CEO',       Icon:Crown,     color:'#a855f7', desc:'Full access · Investments · Command Center' },
]

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [focusedField, setFocused] = useState(null)
  const [visible, setVisible]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const u = username.trim()
    if (!u) return setError('Please enter your username.')
    if (!password) return setError('Please enter your password.')
    setLoading(true)
    try {
      const u = username.trim()
      
      // Authenticate directly against the public.users table
      const { data: user, error: dbErr } = await supabase
        .from('users')
        .select('*')
        .eq('username', u)
        .eq('password', password)
        .maybeSingle()

      if (dbErr) {
        console.error('[Database] Connection failed:', dbErr)
        throw new Error(`Database Error: ${dbErr.message || 'Check your network and Supabase table status.'}`)
      }

      if (!user) {
        throw new Error('Invalid username or password.')
      }
      
      // Persist session in localStorage since we're not using Supabase Auth
      localStorage.setItem('ekanta_session', JSON.stringify(user))
      
      console.log('[Auth] Login complete. Role:', user.role)
      onLogin(user.role.toLowerCase(), user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inpBase = focused => ({
    width:'100%', padding:'10px 12px 10px 38px',
    background:'var(--surface2)',
    border:`1px solid ${focused ? 'var(--admin)' : 'var(--border2)'}`,
    borderRadius:8, fontSize:13.5, color:'var(--text)',
    fontFamily:'inherit', outline:'none',
    boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
    transition:'border-color 0.15s, box-shadow 0.15s',
  })

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{
        width:'100%', maxWidth:980,
        display:'grid', gridTemplateColumns:'1fr 400px',
        borderRadius:14, overflow:'hidden',
        border:'1px solid var(--border2)',
        boxShadow:'0 32px 100px rgba(0,0,0,0.55)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition:'opacity 0.4s ease, transform 0.4s ease',
      }}>

        {/* ── Left Panel ─────────────────────────────── */}
        <div style={{ padding:'48px 44px', background:'var(--surface)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:52 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:'var(--admin)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:800, color:'#fff' }}>E</div>
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, color:'var(--text)', letterSpacing:'-0.02em', lineHeight:1 }}>Ekanta</div>
              <div style={{ fontSize:9.5, color:'var(--text3)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:2 }}>Business Intelligence Platform</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:22, height:2, background:'var(--admin)', borderRadius:1 }} />
            <span style={{ fontSize:10.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--admin)' }}>Unified Command</span>
          </div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:36, fontWeight:800, lineHeight:1.08, letterSpacing:'-0.03em', color:'var(--text)', marginBottom:16 }}>
            One platform.<br />
            <span style={{ color:'var(--text2)', fontWeight:600 }}>Every insight.</span>
          </h1>
          <p style={{ fontSize:13.5, color:'var(--text3)', lineHeight:1.7, maxWidth:340, marginBottom:36 }}>
            Admin operations, marketing performance, and CEO-level intelligence in one beautifully designed workspace.
          </p>

          {/* Role cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {ROLES.map(({ key, label, Icon, color, desc }) => (
              <div key={key} style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'10px 13px', borderRadius:9,
                border:'1px solid var(--border)', background:'var(--surface2)',
              }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${color}1a`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text)' }}>{label}</div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:1 }}>{desc}</div>
                </div>
                <div style={{ width:5, height:5, borderRadius:'50%', background:color, flexShrink:0 }} />
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{ marginTop:'auto', paddingTop:32, display:'flex', flexDirection:'column', gap:5 }}>
            {['Real-time Supabase sync', 'PDF & Excel export', 'Role-based access control', 'Light & dark mode'].map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'var(--text3)' }}>
                <CheckCircle size={12} style={{ color:'var(--green)', flexShrink:0 }} />{f}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel (Form) ─────────────────────── */}
        <div style={{ padding:'48px 40px', background:'var(--surface)', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:23, fontWeight:700, color:'var(--text)', letterSpacing:'-0.02em', marginBottom:6 }}>Welcome back</h2>
            <p style={{ fontSize:13, color:'var(--text2)' }}>Sign in to your workspace</p>
          </div>

          {/* Demo hint */}
          {!isConfigured && (
            <div style={{ background:'rgba(59,130,246,0.07)', border:'1px solid rgba(59,130,246,0.18)', borderRadius:8, padding:'9px 12px', fontSize:11.5, color:'#93c5fd', marginBottom:20, lineHeight:1.6 }}>
              <strong>Demo mode</strong><br />
              admin / admin123 &nbsp;·&nbsp; marketing / mkt123 &nbsp;·&nbsp; ceo / ceo123
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Username */}
            <div>
              <label style={{ fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', display:'block', marginBottom:6 }}>Username</label>
              <div style={{ position:'relative' }}>
                <User size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }} />
                <input
                  type="text" value={username} placeholder="Enter your username"
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocused('u')} onBlur={() => setFocused(null)}
                  style={inpBase(focusedField === 'u')}
                  autoCapitalize="none" autoCorrect="off" autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', display:'block', marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }} />
                <input
                  type={showPass ? 'text' : 'password'} value={password} placeholder="Enter your password"
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('p')} onBlur={() => setFocused(null)}
                  style={{ ...inpBase(focusedField === 'p'), paddingRight:40 }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex', padding:4 }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:7, padding:'9px 12px', fontSize:12.5, color:'#fca5a5', lineHeight:1.5 }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width:'100%', padding:'12px 0', borderRadius:8, border:'none',
                background:'var(--admin)', color:'#fff', fontSize:14, fontWeight:600,
                fontFamily:'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                transition:'opacity 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { if(!loading) e.currentTarget.style.transform='translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='none' }}
            >
              {loading
                ? <><div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite' }} />Signing in…</>
                : <><ArrowRight size={15} />Sign in to Ekanta</>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0' }}>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
            <span style={{ fontSize:11.5, color:'var(--text3)' }}>single sign-on</span>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
          </div>

          {/* SSO buttons */}
          <div style={{ display:'flex', gap:8 }}>
            {['Google SSO','Microsoft SSO'].map(label => (
              <button key={label} type="button" disabled
                title="Configure SSO in Supabase Auth settings"
                style={{
                  flex:1, padding:'9px', borderRadius:8,
                  border:'1px solid var(--border)', background:'var(--surface2)',
                  color:'var(--text3)', fontSize:11.5, cursor:'not-allowed',
                  fontFamily:'inherit', opacity:0.55,
                }}>{label}</button>
            ))}
          </div>

          <p style={{ marginTop:24, fontSize:11, color:'var(--text3)', textAlign:'center', lineHeight:1.6 }}>
            Contact your administrator for access issues.<br />
            Data encrypted in transit and at rest.
          </p>
        </div>
      </div>
    </div>
  )
}
