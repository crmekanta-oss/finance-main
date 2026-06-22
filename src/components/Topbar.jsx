import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Sun, Moon, Bell, LogOut, Search, X, CheckCircle, AlertTriangle, Info, Clock, ExternalLink, User, ShoppingBag, CreditCard, Package, Truck, Layout, Briefcase, FileText, Sparkles, TrendingUp, Users } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabase'

const ROLE_META = {
  admin:     { label: 'Admin',     initial: 'A', color: 'var(--admin)' },
  marketing: { label: 'Marketing', initial: 'M', color: 'var(--mkt)'   },
  ceo:       { label: 'CEO',       initial: 'C', color: 'var(--ceo)'   },
}

const NOTIFICATIONS = [
  { id: 1, type: 'alert', title: 'Low Stock Warning', body: 'Silk Sarees are below reorder level (12 units left)', time: '10m ago', icon: AlertTriangle, color: 'var(--red)' },
  { id: 2, type: 'success', title: 'Payment Received', body: 'Payment of ₹2.4L received from Taamara Silks', time: '1h ago', icon: CheckCircle, color: 'var(--green)' },
  { id: 3, type: 'info', title: 'New Sales Goal', body: 'Monthly sales target increased by 15% for Q2', time: '3h ago', icon: Info, color: 'var(--admin)' },
  { id: 4, type: 'pending', title: 'Pending Approval', body: 'Strategic decision "Warehouse Expansion" needs review', time: '5h ago', icon: Clock, color: 'var(--amber)' },
]

const SEARCH_SUGGESTIONS = [
  { label: 'Sales Entry', mod: 'sales', icon: ShoppingBag },
  { label: 'Inventory Management', mod: 'inventory', icon: Package },
  { label: 'Supplier Payments', mod: 'payments', icon: CreditCard },
  { label: 'Marketing ROI', mod: 'roi', icon: TrendingUp },
  { label: 'Team Settings', mod: 'team', icon: Users },
]

export default function Topbar({ role, user, onLogout, onRoleSwitch, loggedInRole, setModule }) {
  const { dark, toggle } = useTheme()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [globalData, setGlobalData] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  
  const notifRef = useRef(null)
  const searchRef = useRef(null)

  const norm = (role || 'admin').toLowerCase()
  const meta = ROLE_META[norm] || ROLE_META.admin
  const isCeo = (loggedInRole || '').toLowerCase() === 'ceo'

  const btnStyle = {
    width: 32, height: 32, borderRadius: 7,
    background: 'var(--surface2)', border: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--text2)', transition: 'border-color 0.15s, color 0.15s',
    flexShrink: 0,
  }

  // Keyboard Shortcut: CTRL + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Fetch Global Data for Client Search
  useEffect(() => {
    if (!showSearch) return
    
    const fetchAll = async () => {
      setLoadingSearch(true)
      try {
        const [sales, inv, pay, recv, fab, team, google, meta, comm, invest, dcsns] = await Promise.all([
          supabase.from('sales_entries').select('*'),
          supabase.from('inventory').select('*'),
          supabase.from('supplier_payments').select('*'),
          supabase.from('receivables').select('*'),
          supabase.from('fabric_orders').select('*'),
          supabase.from('users').select('*'),
          supabase.from('google_ads').select('*'),
          supabase.from('meta_ads').select('*'),
          supabase.from('communication_ads').select('*'),
          supabase.from('investments').select('*'),
          supabase.from('strategic_decisions').select('*')
        ])

        const combined = [
          ...(sales.data || []).map(d => ({
            ...d,
            _mod: 'sales',
            _label: 'Sales Entry',
            _client: d.client,
            _info: `${d.product}`,
            _amount: `₹${Number(d.amount || 0).toLocaleString('en-IN')}`,
            _status: d.status,
            _icon: ShoppingBag,
            _search_index: `${d.client} ${d.product} ${d.amount} ${d.date} ${d.status} sales entry`.toLowerCase()
          })),
          ...(inv.data || []).map(d => ({
            ...d,
            _mod: 'inventory',
            _label: 'Inventory',
            _client: d.name,
            _info: `${d.sku}`,
            _amount: `₹${Number(d.selling_price || 0).toLocaleString('en-IN')}`,
            _status: d.stock_status || d.status,
            _icon: Package,
            _search_index: `${d.name} ${d.sku} ${d.barcode} ${d.category} ${d.supplier_name} ${d.warehouse_loc} ${d.stock_status} inventory`.toLowerCase()
          })),
          ...(pay.data || []).map(d => ({
            ...d,
            _mod: 'payments',
            _label: 'Payments',
            _client: d.supplier,
            _info: `Invoice ${d.invoice}`,
            _amount: `₹${Number(d.total_amount || d.amount || 0).toLocaleString('en-IN')}`,
            _status: d.status,
            _icon: CreditCard,
            _search_index: `${d.supplier} ${d.invoice} ${d.total_amount} ${d.amount} ${d.payment_method} ${d.status} payments`.toLowerCase()
          })),
          ...(recv.data || []).map(d => ({
            ...d,
            _mod: 'receivables',
            _label: 'Receivables',
            _client: d.client,
            _info: `Invoice ${d.invoice}`,
            _amount: `₹${Number(d.amount || 0).toLocaleString('en-IN')}`,
            _status: d.status,
            _icon: Briefcase,
            _search_index: `${d.client} ${d.invoice} ${d.amount} ${d.status} receivables`.toLowerCase()
          })),
          ...(fab.data || []).map(d => ({
            ...d,
            _mod: 'fabric',
            _label: 'Fabric Orders',
            _client: d.supplier,
            _info: d.fabric,
            _amount: `₹${Number(d.amount || 0).toLocaleString('en-IN')}`,
            _status: d.status,
            _icon: Truck,
            _search_index: `${d.supplier} ${d.fabric} ${d.qty} ${d.amount} ${d.status} fabric orders`.toLowerCase()
          })),
          ...(team.data || []).map(d => ({
            ...d,
            _mod: 'team',
            _label: 'Team Member',
            _client: d.name,
            _info: d.role,
            _amount: '—',
            _status: d.status || 'Active',
            _icon: User,
            _search_index: `${d.name} ${d.username} ${d.role} ${d.status} team member`.toLowerCase()
          })),
          ...(google.data || []).map(d => ({
            ...d,
            _mod: 'google',
            _label: 'Google Ads',
            _client: d.campaign,
            _info: d.type,
            _amount: `₹${Number(d.revenue || 0).toLocaleString('en-IN')}`,
            _status: d.status,
            _icon: TrendingUp,
            _search_index: `${d.campaign} ${d.type} ${d.budget} ${d.spend} ${d.status} google ads`.toLowerCase()
          })),
          ...(meta.data || []).map(d => ({
            ...d,
            _mod: 'meta',
            _label: 'Meta Ads',
            _client: d.campaign,
            _info: d.type,
            _amount: `₹${Number(d.revenue || 0).toLocaleString('en-IN')}`,
            _status: d.status,
            _icon: TrendingUp,
            _search_index: `${d.campaign} ${d.type} ${d.budget} ${d.spend} ${d.status} meta ads`.toLowerCase()
          })),
          ...(comm.data || []).map(d => ({
            ...d,
            _mod: 'comm',
            _label: 'Comms Ads',
            _client: d.campaign,
            _info: d.type,
            _amount: `₹${Number(d.revenue || 0).toLocaleString('en-IN')}`,
            _status: d.status || 'Active',
            _icon: Bell,
            _search_index: `${d.campaign} ${d.type} ${d.budget} ${d.spend} ${d.status} comms ads`.toLowerCase()
          })),
          ...(invest.data || []).map(d => ({
            ...d,
            _mod: 'investments',
            _label: 'Investments',
            _client: d.name,
            _info: d.type,
            _amount: d.val,
            _status: d.up === 'Yes' ? 'Active' : d.up === 'No' ? 'Declining' : 'Neutral',
            _icon: Briefcase,
            _search_index: `${d.name} ${d.type} ${d.val} ${d.note} investments`.toLowerCase()
          })),
          ...(dcsns.data || []).map(d => ({
            ...d,
            _mod: 'decisions',
            _label: 'Decisions',
            _client: d.title,
            _info: d.body,
            _amount: '—',
            _status: d.status || 'Pending',
            _icon: FileText,
            _search_index: `${d.title} ${d.body} ${d.status} strategic decisions`.toLowerCase()
          }))
        ]
        setGlobalData(combined)
      } catch (err) {
        console.error('Search data fetch failed:', err)
      } finally {
        setLoadingSearch(false)
      }
    }
    fetchAll()
  }, [showSearch])

  // Handle outside clicks
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
    }
    if (showNotifs) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showNotifs])

  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return []
    
    return globalData.filter(item => 
      (item._search_index || '').includes(q)
    ).slice(0, 8)
  }, [searchQuery, globalData])

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <header style={{
      height: 54, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0, zIndex: 100, position: 'relative',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7, background: meta.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 800, color: '#fff',
          transition: 'background 0.25s', userSelect: 'none',
        }}>T</div>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>Ekanta Studio</div>
          <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1, marginTop: 2 }}>Trade Management</div>
        </div>
      </div>

      {/* CEO View Switcher — only shown to CEO */}
      {isCeo && (
        <div style={{ display: 'flex', gap: 2, background: 'var(--surface2)', borderRadius: 8, padding: 3, border: '1px solid var(--border)' }}>
          {['admin', 'marketing', 'ceo'].map(r => (
            <button key={r} onClick={() => onRoleSwitch(r)}
              style={{
                padding: '4px 14px', borderRadius: 6, border: '1px solid transparent',
                cursor: 'pointer', fontSize: 11.5, fontWeight: 500,
                fontFamily: 'Inter, sans-serif', textTransform: 'capitalize',
                background: norm === r ? 'var(--surface)' : 'transparent',
                color: norm === r ? 'var(--text)' : 'var(--text2)',
                borderColor: norm === r ? 'var(--border2)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {{ admin: 'Admin', marketing: 'Marketing', ceo: 'CEO' }[r]}
            </button>
          ))}
        </div>
      )}

      {/* Right bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Live pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7, padding: '0 10px', height: 28 }}>
          <div className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text2)' }}>Live</span>
        </div>

        <button 
          style={{ ...btnStyle, borderColor: showSearch ? 'var(--admin)' : 'var(--border)', color: showSearch ? 'var(--text)' : 'var(--text2)' }} 
          onClick={() => setShowSearch(true)}
          aria-label="Search" title="Search">
          <Search size={14} />
        </button>

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            style={{ ...btnStyle, position: 'relative', borderColor: showNotifs ? 'var(--admin)' : 'var(--border)', color: showNotifs ? 'var(--text)' : 'var(--text2)' }} 
            onClick={() => setShowNotifs(!showNotifs)}
            aria-label="Notifications" title="Notifications">
            <Bell size={14} />
            <span style={{ position: 'absolute', top: 7, right: 7, width: 5, height: 5, borderRadius: '50%', background: 'var(--red)', border: '1.5px solid var(--surface)' }} />
          </button>

          {showNotifs && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: 320, background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              overflow: 'hidden', zIndex: 1000,
            }} className="fade-up">
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Notifications</span>
                <span style={{ fontSize: 11, color: 'var(--admin)', fontWeight: 600, cursor: 'pointer' }}>Mark all as read</span>
              </div>
              <div style={{ maxHeight: 360, overflowY: 'auto' }} className="custom-scrollbar">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: n.color }}>
                      <n.icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.4, marginBottom: 4 }}>{n.body}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
                <span style={{ fontSize: 11.5, color: 'var(--text2)', fontWeight: 500, cursor: 'pointer' }}>View all notifications</span>
              </div>
            </div>
          )}
        </div>

        <button style={btnStyle} onClick={toggle} aria-label="Toggle theme" title="Toggle theme">
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 2px' }} />

        {/* User info */}
        <div style={{ display:'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: meta.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', transition: 'background 0.25s', flexShrink: 0,
          }}>{meta.initial}</div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
              {user?.name || user?.username || meta.label}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--text3)' }}>{meta.label} role</div>
          </div>
        </div>

        <button style={{ ...btnStyle, marginLeft: 2 }} onClick={onLogout} aria-label="Sign out" title="Sign out"
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = 'var(--red)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}>
          <LogOut size={14} />
        </button>
      </div>

      {/* Search Modal Portal */}
      {showSearch && createPortal(
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)', zIndex: 10000,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '15vh',
        }} onClick={() => setShowSearch(false)}>
          <div style={{
            width: '100%', maxWidth: 500, background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)', overflow: 'hidden',
          }} onClick={e => e.stopPropagation()} className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 18px', gap: 12, borderBottom: '1px solid var(--border)' }}>
              <Search size={18} color="var(--text3)" />
              <input 
                autoFocus
                placeholder="Search modules, clients... (CTRL+K)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  outline: 'none', color: 'var(--text)', fontSize: 15,
                  fontFamily: 'inherit',
                }}
              />
              <button onClick={() => setShowSearch(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '8px 0', maxHeight: 400, overflowY: 'auto' }} className="custom-scrollbar">
              {loadingSearch && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)' }}>
                  <div className="spin" style={{ width: 16, height: 16, border: '2px solid var(--border)', borderTopColor: 'var(--admin)', borderRadius: '50%', margin: '0 auto 8px' }} />
                  Indexing global trade data...
                </div>
              )}

              {/* Dynamic Search Results */}
              {searchQuery && !loadingSearch && (
                <>
                  <div style={{ padding: '8px 18px', fontSize: 10.5, fontWeight: 700, color: 'var(--admin)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={12} /> AI Search Results
                  </div>
                  {filteredResults.length > 0 ? filteredResults.map((r, i) => (
                    <div key={i} 
                      style={{
                        background: 'var(--surface2)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        padding: '14px 16px',
                        margin: '10px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--admin)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(59,130,246,0.15)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }}
                    >
                      {/* Card Header: Icon + Info */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'var(--surface3)', border: '1px solid var(--border2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin)',
                            flexShrink: 0
                          }}>
                            <r._icon size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>
                              {r._client || '—'}
                            </div>
                            <div style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 2 }}>
                              {r._info || '—'} • {r._label}
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          fontFamily: 'Syne, sans-serif', 
                          fontSize: 14.5, 
                          fontWeight: 800, 
                          color: 'var(--text)',
                          textAlign: 'right'
                        }}>
                          {r._amount || '—'}
                        </div>
                      </div>

                      {/* Card Footer: Status + Open Button */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <div style={{ 
                          fontSize: 10, 
                          fontWeight: 700, 
                          padding: '4px 10px', 
                          borderRadius: 6,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          background: r._status === 'Completed' || r._status === 'Paid' || r._status === 'In Stock' || r._status === 'Received' || r._status === 'Active'
                            ? 'rgba(34,197,94,0.1)' 
                            : r._status === 'Pending' || r._status === 'Ordered' || r._status === 'In Transit' || r._status === 'Low Stock'
                              ? 'rgba(245,158,11,0.1)' 
                              : 'rgba(239,68,68,0.1)',
                          color: r._status === 'Completed' || r._status === 'Paid' || r._status === 'In Stock' || r._status === 'Received' || r._status === 'Active'
                            ? 'var(--green)' 
                            : r._status === 'Pending' || r._status === 'Ordered' || r._status === 'In Transit' || r._status === 'Low Stock'
                              ? 'var(--amber)' 
                              : 'var(--red)',
                        }}>
                          {r._status || 'Active'}
                        </div>
                        
                        <button
                          onClick={() => {
                            if (setModule) setModule(r._mod)
                            const event = new CustomEvent('dashboard-search', {
                              detail: {
                                module: r._mod,
                                query: r._client || r._info || '',
                                id: r.id,
                                record: r
                              }
                            })
                            window.dispatchEvent(event)
                            setShowSearch(false)
                          }}
                          style={{
                            height: 28,
                            padding: '0 14px',
                            borderRadius: 8,
                            border: 'none',
                            background: 'var(--admin)',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: '0 2px 6px rgba(59,130,246,0.2)',
                            transition: 'opacity 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          OPEN <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                      <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 4 }}>No direct matches found</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>Try searching for a different client or keyword</div>
                    </div>
                  )}
                </>
              )}

              {/* Module Suggestions */}
              <div style={{ padding: '16px 18px 8px', fontSize: 10.5, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Jump
              </div>
              {filteredSuggestions.map(s => (
                <div key={s.mod} 
                  onClick={() => {
                    if (setModule) setModule(s.mod)
                    setShowSearch(false)
                  }}
                  style={{
                    padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)' }}>
                    <s.icon size={14} />
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{s.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--text3)', background: 'var(--surface3)', padding: '2px 6px', borderRadius: 4 }}>Jump</span>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.getElementById('modal-root')
      )}
    </header>
  )
}

