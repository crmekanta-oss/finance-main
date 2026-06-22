import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import LoginPage from './pages/LoginPage'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import AdminDashboard from './pages/AdminDashboard'
import MarketingDashboard from './pages/MarketingDashboard'
import CeoDashboard from './pages/CeoDashboard'
import { FileText, Download } from 'lucide-react'
import { supabase } from './lib/supabase'
import { exportToPDF, exportToExcel } from './utils/exportUtils'
import AiAssistant from './components/AiAssistant'

// ─── Reports Page ─────────────────────────────────────────────────────────────
const REPORTS = [
  { id: 'pnl', name:'Monthly P&L Statement',    period:'Apr 2026', gen:'1 May 2026',  fmt:'PDF',   size:'248 KB', table: 'sales_entries' },
  { id: 'sales', name:'Sales Performance Report', period:'Q1 2026',  gen:'2 Apr 2026',  fmt:'Excel', size:'1.2 MB', table: 'sales_entries' },
  { id: 'mkt', name:'Marketing ROI Summary',    period:'May 2026', gen:'21 May 2026', fmt:'PDF',   size:'180 KB', table: 'google_ads' },
  { id: 'inv', name:'Inventory Valuation',      period:'May 2026', gen:'21 May 2026', fmt:'Excel', size:'inventory', table: 'inventory' },
  { id: 'recv', name:'Receivables Ageing',       period:'May 2026', gen:'21 May 2026', fmt:'Excel', size:'310 KB', table: 'receivables' },
  { id: 'ceo', name:'CEO Board Summary',        period:'Q1 2026',  gen:'3 Apr 2026',  fmt:'PDF',   size:'420 KB', table: 'users' },
]

const REPORT_COLS = [
  { key: 'name', label: 'Report Name' },
  { key: 'period', label: 'Reporting Period' },
  { key: 'gen', label: 'Generated' },
  { key: 'fmt', label: 'Format' },
]

function ReportsPage() {
  const handleReportDownload = async (report) => {
    try {
      const { data, error } = await supabase.from(report.table).select('*')
      if (error) throw error
      
      // Map generic data to report columns
      const cols = data.length > 0 ? Object.keys(data[0]).map(k => ({ key: k, label: k.toUpperCase() })) : []
      
      if (report.fmt === 'PDF') {
        exportToPDF(report.name, cols, data)
      } else {
        exportToExcel(report.name, cols, data)
      }
    } catch (err) {
      alert(`Report generation failed: ${err.message}`)
    }
  }

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'var(--text)' }}>Business Reports</h1>
        <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>Generate and export operational data</p>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                {REPORT_COLS.map(c => (
                  <th key={c.key} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>{c.label}</th>
                ))}
                <th style={{ width: 100 }} />
              </tr>
            </thead>
            <tbody>
              {REPORTS.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {REPORT_COLS.map(c => (
                    <td key={c.key} style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text2)' }}>{r[c.key]}</td>
                  ))}
                  <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleReportDownload(r)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 6, padding: '6px 12px', color: 'var(--text)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--admin)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                    >
                      <Download size={14} /> {r.fmt}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Loading spinner ──────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:28, height:28, borderRadius:'50%', border:'3px solid rgba(59,130,246,0.15)', borderTopColor:'var(--admin)', animation:'spin 0.7s linear infinite' }} />
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function AppInner() {
  const [loggedIn, setLoggedIn]   = useState(false)
  const [role, setRole]           = useState(null)      // actual role from login
  const [viewRole, setViewRole]   = useState(null)      // CEO can switch view
  const [module, setModule]       = useState('dashboard')
  const [user, setUser]           = useState(null)
  const [appLoading, setAppLoading] = useState(true)
  const initDone = useRef(false)

  // Restore session
  useEffect(() => {
    if (initDone.current) return
    initDone.current = true

    const checkUser = async () => {
      try {
        // Read session from localStorage instead of Supabase Auth
        const savedSession = localStorage.getItem('ekanta_session')
        if (savedSession) {
          const userProfile = JSON.parse(savedSession)
          // Verify user still exists in DB
          const { data: latestProfile } = await supabase
            .from('users').select('*').eq('id', userProfile.id).single()
          
          if (latestProfile) {
            const r = (latestProfile.role || '').toLowerCase()
            setUser(latestProfile); setRole(r); setViewRole(r); setLoggedIn(true)
          } else {
            localStorage.removeItem('ekanta_session')
          }
        }
      } catch (err) {
        console.error('Session restore failed:', err)
      } finally {
        setAppLoading(false)
      }
    }

    checkUser()
  }, [])

  const handleLogin = (r, profile) => {
    setRole(r); setViewRole(r); setUser(profile)
    setModule('dashboard'); setLoggedIn(true)
  }

  const handleLogout = () => {
    // Clear manual session
    localStorage.removeItem('ekanta_session')
    setLoggedIn(false); setRole(null); setViewRole(null); setUser(null); setModule('dashboard')
  }

  // Only CEO can switch view perspective
  const handleRoleSwitch = r => {
    if (role !== 'ceo') return
    setViewRole(r); setModule('dashboard')
  }

  if (appLoading) return (
    <div style={{ height:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Spinner />
    </div>
  )

  if (!loggedIn) return <LoginPage onLogin={handleLogin} />

  const activeRole = viewRole || role

  // ── Page router ──────────────────────────────────────────────────────────
  const renderPage = () => {
    if (module === 'reports') return <ReportsPage />

    const adminOnlyMods = ['sales','inventory','payments','receivables','fabric']
    const mktOnlyMods   = ['google','meta','comm','roi','abandoned']
    const ceoOnlyMods   = ['investments','team','decisions']

    // CEO-only pages always go to CeoDashboard regardless of viewRole
    if (ceoOnlyMods.includes(module)) return <CeoDashboard activeModule={module} />

    // Route by active (view) role
    switch (activeRole) {
      case 'ceo':
        if (adminOnlyMods.includes(module)) return <AdminDashboard activeModule={module} />
        if (mktOnlyMods.includes(module))   return <MarketingDashboard activeModule={module} />
        return <CeoDashboard activeModule="dashboard" />
      case 'marketing':
        return <MarketingDashboard activeModule={module} />
      default: // admin
        return <AdminDashboard activeModule={module} />
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--bg)', overflow:'hidden' }}>
      <Topbar
        role={activeRole}
        user={user}
        onLogout={handleLogout}
        onRoleSwitch={handleRoleSwitch}
        loggedInRole={role}
        setModule={setModule}
      />
      <div style={{ display:'flex', flex:1, overflow:'hidden', minHeight:0 }}>
        <Sidebar
          role={activeRole}
          activeModule={module}
          setModule={setModule}
        />
        <main style={{
          flex:1, overflowY:'auto',
          padding:'22px 26px',
          background:'var(--bg)',
          minWidth:0,
          position: 'relative',
        }}>
          {renderPage()}
          <AiAssistant setModule={setModule} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <ThemeProvider><AppInner /></ThemeProvider>
}
