import { useState, useMemo, useEffect } from 'react'
import { 
  TrendingUp, Users, DollarSign, Target, 
  ArrowUpRight, ArrowDownRight, MoreVertical, 
  Search, Filter, Download, Plus, X,
  Zap, Brain, Sparkles, BarChart3
} from 'lucide-react'
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts'
import { useTable } from '../hooks/useTable'
import DataTable from '../components/DataTable'
import DataModal from '../components/DataModal'
import { FORM_SCHEMAS } from '../data/seedData'
import { exportToPDF, exportToExcel } from '../utils/exportUtils'

// ── Components ───────────────────────────────────────────────────────────────
const fmtCur = v => `₹${((v || 0)/100000).toFixed(1)}L`
const fmtNum = v => new Intl.NumberFormat('en-IN').format(v)
const ttpStyle = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, fontSize:12, color:'var(--text)' }

const Panel = ({ title, children, subtitle, tag, tagBg, tagColor }) => (
  <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column' }}>
    <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div>
        <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text)', fontFamily:'Syne, sans-serif' }}>{title}</h3>
        {subtitle && <p style={{ fontSize:10.5, color:'var(--text3)', marginTop:2 }}>{subtitle}</p>}
      </div>
      {tag && <span style={{ padding:'3px 8px', borderRadius:5, background:tagBg||'var(--surface2)', color:tagColor||'var(--text2)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.03em' }}>{tag}</span>}
    </div>
    {children}
  </div>
)

const AiInsight = ({ title, body, type }) => (
  <div style={{ 
    padding: '12px 14px', borderRadius: 10, background: 'var(--surface2)', 
    borderLeft: `3px solid ${type === 'positive' ? 'var(--green)' : type === 'warning' ? 'var(--red)' : 'var(--admin)'}`,
    marginBottom: 10
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <Zap size={14} color={type === 'positive' ? 'var(--green)' : type === 'warning' ? 'var(--red)' : 'var(--admin)'} />
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{title}</span>
    </div>
    <p style={{ fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.5 }}>{body}</p>
  </div>
)

const StatCard = ({ icon: Icon, label, value, change, up, accentColor }) => (
  <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:18, position:'relative', overflow:'hidden' }}>
    <div style={{ width:38, height:38, borderRadius:10, background:`${accentColor}12`, display:'flex', alignItems:'center', justifyContent:'center', color:accentColor, marginBottom:16 }}>
      <Icon size={20} />
    </div>
    {label && <div style={{ fontSize:12, fontWeight:500, color:'var(--text3)', marginBottom:6 }}>{label}</div>}
    <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop: label ? 0 : 22 }}>
      <div style={{ fontSize:22, fontWeight:700, color:'var(--text)', letterSpacing:'-0.01em', fontFamily:'Syne, sans-serif', textDecoration:'none', WebkitTextDecoration:'none', lineHeight:1.2 }}>{value}</div>
      <div style={{ fontSize:11, fontWeight:600, color:up?'var(--green)':'var(--red)', display:'flex', alignItems:'center' }}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    {/* Subtle background decoration */}
    <div style={{ position:'absolute', top:-10, right:-10, width:60, height:60, borderRadius:'50%', background:`${accentColor}05` }} />
  </div>
)

// ── Dashboard Page ───────────────────────────────────────────────────────────
export default function CeoDashboard({ activeModule = 'dashboard' }) {
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [highlight, setHighlight] = useState('')

  const sales  = useTable('sales_entries',  [])
  const google = useTable('google_ads',    [])
  const meta   = useTable('meta_ads',      [])
  const team   = useTable('users',         [])
  const invest = useTable('investments',   [])
  const dcsns  = useTable('strategic_decisions', [])

  useEffect(() => {
    const handleSearch = (e) => {
      const { module, query, id, record } = e.detail
      const ceoModules = ['team', 'investments', 'decisions', 'dashboard']
      // Accept any CEO-domain module regardless of current activeModule (timing-safe)
      if (!ceoModules.includes(module)) return

      setHighlight(query)
      setTimeout(() => setHighlight(''), 5000)

      if (id || record) {
        let tbl
        let key
        if (module === 'team') { tbl = team; key = 'team' }
        else if (module === 'investments') { tbl = invest; key = 'invest' }
        else if (module === 'decisions') { tbl = dcsns; key = 'dcsns' }

        if (tbl) {
          const row = tbl.rows.find(r => r.id === id) || record
          if (row) {
            setTimeout(() => {
              openEdit(key, row)
            }, 100)
          }
        }
      }
    }
    window.addEventListener('dashboard-search', handleSearch)
    return () => window.removeEventListener('dashboard-search', handleSearch)
  }, [activeModule, team, invest, dcsns])

  const totRevenue = useMemo(() => sales.rows.reduce((s,r)=>s+Number(r.amount||0),0), [sales.rows])
  const gSpend = useMemo(() => google.rows.reduce((s,r)=>s+Number(r.spend||0),0), [google.rows])
  const gRev   = useMemo(() => google.rows.reduce((s,r)=>s+Number(r.revenue||0),0), [google.rows])
  const mSpend = useMemo(() => meta.rows.reduce((s,r)=>s+Number(r.spend||0),0), [meta.rows])
  const mRev   = useMemo(() => meta.rows.reduce((s,r)=>s+Number(r.revenue||0),0), [meta.rows])
  const totAdSpend = gSpend + mSpend
  const totAdRev   = gRev + mRev
  const blendRoas  = totAdSpend > 0 ? (totAdRev/totAdSpend).toFixed(2) : '0.00'

  // Dynamic Chart Data from Supabase
  const dynamicRevTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dataMap = {}
    
    sales.rows.forEach(r => {
      const d = new Date(r.date || r.created_at)
      const m = months[d.getMonth()]
      dataMap[m] = (dataMap[m] || 0) + Number(r.amount || 0)
    })

    const adMap = {}
    google.rows.forEach(r => {
      const d = new Date(r.created_at)
      const m = months[d.getMonth()]
      adMap[m] = (adMap[m] || 0) + Number(r.spend || 0)
    })
    meta.rows.forEach(r => {
      const d = new Date(r.created_at)
      const m = months[d.getMonth()]
      adMap[m] = (adMap[m] || 0) + Number(r.spend || 0)
    })

    return months.map(m => ({
      month: m,
      revenue: dataMap[m] || 0,
      adspend: adMap[m] || 0
    })).filter(d => d.revenue > 0 || d.adspend > 0)
  }, [sales.rows, google.rows, meta.rows])

  const dynamicTopClients = useMemo(() => {
    const clients = {}
    sales.rows.forEach(r => {
      if (!r.client) return
      clients[r.client] = (clients[r.client] || 0) + Number(r.amount || 0)
    })
    return Object.entries(clients)
      .map(([name, rev]) => ({ name, rev: fmtCur(rev), raw: rev }))
      .sort((a, b) => b.raw - a.raw)
      .slice(0, 5)
  }, [sales.rows])

  const dynamicRevMix = useMemo(() => {
    const products = {}
    sales.rows.forEach(r => {
      if (!r.product) return
      products[r.product] = (products[r.product] || 0) + Number(r.amount || 0)
    })
    const total = Object.values(products).reduce((a, b) => a + b, 0)
    const colors = ['var(--ceo)', 'var(--admin)', 'var(--green)', 'var(--amber)', 'var(--mkt)', 'var(--red)']
    return Object.entries(products)
      .map(([name, val], i) => ({ 
        name, 
        value: total > 0 ? Math.round((val / total) * 100) : 0,
        color: colors[i % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4)
  }, [sales.rows])

  const openAdd  = key => { setEditing(null); setModal(key) }
  const openEdit = (key, row) => { setEditing(row); setModal(key) }
  const closeModal = () => { setModal(false); setEditing(null) }

  const handleSave = async form => {
    try {
      let tbl
      if (modal === 'invest') tbl = invest
      else if (modal === 'dcsns') tbl = dcsns
      else if (modal === 'team')  tbl = team
      
      if (!tbl) throw new Error(`Invalid modal state: ${modal}`)

      if (editing) {
        await tbl.edit(editing.id, form)
      } else {
        const payload = { ...form }
        if (modal === 'team') {
          payload.status = 'Active'
        }
        await tbl.add(payload)
      }
      closeModal()
    } catch (err) {
      alert(`Error saving: ${err.message}`)
    }
  }

  // ── Team Sub-page ──
  if (activeModule === 'team') {
    return (
      <div className="fade-up">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily:'Syne, sans-serif', fontSize:20, fontWeight:700, color:'var(--text)' }}>Management Team</h1>
          <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>Onboard and manage team members and permissions</p>
        </div>
        <Panel title="Team Directory" subtitle={`${team.rows.length} Active Members`}>
          <div style={{ padding: '0 16px 12px', borderBottom: '1px solid var(--border)', marginTop: 14 }}>
            <button 
              onClick={() => openAdd('team')}
              style={{ width:'100%', height:34, borderRadius:6, border:'1px dashed var(--border2)', background:'var(--surface2)', color:'var(--text2)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              + Onboard New Member
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>Member</th>
                  <th style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>Role</th>
                  <th style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>Status</th>
                  <th style={{ textAlign:'right', padding:'12px 16px' }} />
                </tr>
              </thead>
              <tbody>
                {team.rows.map(m => {
                  const isMatch = highlight && (m.name.toLowerCase().includes(highlight.toLowerCase()) || m.username.toLowerCase().includes(highlight.toLowerCase()));
                  return (
                    <tr key={m.id} style={{ 
                      borderBottom:'1px solid var(--border)',
                      background: isMatch ? 'rgba(168,85,247,0.1)' : 'transparent',
                      borderLeft: isMatch ? '3px solid var(--ceo)' : 'none'
                    }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--surface2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'var(--text2)' }}>{m.name[0]}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color: isMatch ? '#fff' : 'var(--text)' }}>{m.name}</div>
                            <div style={{ fontSize:11, color:'var(--text3)' }}>{m.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ fontSize:12, color:'var(--text2)', textTransform:'capitalize' }}>{m.role}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)' }} />
                          <span style={{ fontSize:12, color:'var(--text2)' }}>Active</span>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', textAlign:'right' }}>
                        <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                          <button onClick={() => openEdit('team', m)} style={{ padding:6, background:'transparent', border:'none', color:'var(--text3)', cursor:'pointer' }}><Plus size={14} /></button>
                          <button onClick={() => team.remove(m.id)} style={{ padding:6, background:'transparent', border:'none', color:'var(--red)', cursor:'pointer' }}><X size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        {modal === 'team' && <DataModal title={editing?'Edit Member':'Add Team Member'} schema={FORM_SCHEMAS.users} initial={editing} onSave={handleSave} onClose={closeModal} />}
      </div>
    )
  }

  // ── Investments Sub-page ──
  if (activeModule === 'investments') {
    return (
      <div className="fade-up">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily:'Syne, sans-serif', fontSize:20, fontWeight:700, color:'var(--text)' }}>Investment Portfolio</h1>
          <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>Monitor and manage business holdings and assets</p>
        </div>
        <Panel title="Asset Allocation" subtitle="Current Positions">
          <div style={{ padding: '0 16px 12px', borderBottom: '1px solid var(--border)', marginTop: 14 }}>
            <button 
              onClick={() => openAdd('invest')}
              style={{ width:'100%', height:34, borderRadius:6, border:'1px dashed var(--border2)', background:'var(--surface2)', color:'var(--text2)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              + Add New Position
            </button>
          </div>
          {invest.rows.map((item,i) => {
            const isMatch = highlight && (item.name.toLowerCase().includes(highlight.toLowerCase()) || item.type.toLowerCase().includes(highlight.toLowerCase()));
            return (
              <div key={i} 
                onDoubleClick={() => openEdit('invest', item)}
                style={{ 
                  display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 16px',borderBottom:'1px solid var(--border)', cursor:'pointer',
                  background: isMatch ? 'rgba(168,85,247,0.1)' : 'transparent',
                  borderLeft: isMatch ? '3px solid var(--ceo)' : 'none'
                }}
                title="Double click to edit">
                <div>
                  <div style={{ fontSize:13,fontWeight:500,color: isMatch ? '#fff' : 'var(--text)' }}>{item.name}</div>
                  <div style={{ fontSize:11,color:'var(--text3)',marginTop:2 }}>{item.type}</div>
                </div>
                <div style={{ textAlign:'right',flexShrink:0,marginLeft:16, display:'flex', alignItems:'center', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:700,color: isMatch ? '#fff' : 'var(--text)' }}>{item.val}</div>
                    <div style={{ fontSize:11,marginTop:2,color:item.up==='Neutral'?'var(--amber)':item.up==='Yes'?'var(--green)':'var(--red)' }}>{item.note}</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); invest.remove(item.id) }}
                    style={{ background:'transparent', border:'none', color:'var(--red)', cursor:'pointer', padding:4, opacity:0.5 }}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </Panel>
        {modal === 'invest' && <DataModal title={editing?'Edit Position':'Add Position'} schema={FORM_SCHEMAS.investments} initial={editing} onSave={handleSave} onClose={closeModal} />}
      </div>
    )
  }

  // ── Decisions Sub-page ──
  if (activeModule === 'decisions') {
    return (
      <div className="fade-up">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily:'Syne, sans-serif', fontSize:20, fontWeight:700, color:'var(--text)' }}>Strategic Decisions</h1>
          <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>Review and action critical business priorities</p>
        </div>
        <Panel title="Action Queue" tag={`${dcsns.rows.length} pending`} tagBg="rgba(239,68,68,0.12)" tagColor="#f87171">
          {dcsns.rows.map((d, i) => (
            <div key={i} style={{ display:'flex',gap:12,padding:'14px 16px',borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:d.dot,marginTop:5,flexShrink:0 }} />
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:5 }}>{d.title}</div>
                <div style={{ fontSize:12.5,color:'var(--text2)',lineHeight:1.6,marginBottom:10 }}>{d.body}</div>
                <div style={{ display:'flex',gap:7 }}>
                  <button 
                    onClick={() => dcsns.remove(d.id)}
                    style={{ height:28,padding:'0 14px',borderRadius:6,border:'none',background:'var(--green)',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit' }}>
                    Approve
                  </button>
                  <button style={{ height:28,padding:'0 14px',borderRadius:6,border:'1px solid var(--border2)',background:'transparent',color:'var(--text2)',fontSize:12,cursor:'pointer',fontFamily:'inherit' }}>
                    Defer
                  </button>
                  <button 
                    onClick={() => dcsns.remove(d.id)}
                    style={{ height:28,padding:'0 14px',borderRadius:6,border:'1px solid rgba(239,68,68,0.25)',background:'transparent',color:'var(--red)',fontSize:12,cursor:'pointer',fontFamily:'inherit' }}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    )
  }

  const handleExportBoardReport = async () => {
    try {
      const cols = [
        { key: 'category', label: 'CATEGORY' },
        { key: 'metric', label: 'METRIC' },
        { key: 'value', label: 'VALUE' }
      ]
      
      const data = [
        { category: 'Financials', metric: 'Total Revenue', value: fmtCur(totRevenue) },
        { category: 'Financials', metric: 'Bank Balance', value: '₹19.1L' },
        { category: 'Marketing', metric: 'Blended ROAS', value: `${blendRoas}x` },
        { category: 'Operations', metric: 'Total Team', value: team.rows.length },
        { category: 'Investments', metric: 'Portfolio Value', value: '₹52L' }
      ]
      
      exportToPDF('CEO Board Report', cols, data)
    } catch (err) {
      alert(`Export failed: ${err.message}`)
    }
  }

  return (
    <div className="fade-up">
      {/* Page Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h1 style={{ fontFamily:'Syne, sans-serif', fontSize:22, fontWeight:800, color:'var(--text)', letterSpacing:'-0.03em' }}>CEO Dashboard</h1>
          <p style={{ fontSize:12.5, color:'var(--text2)', marginTop:4 }}>Strategic oversight & business intelligence</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button style={{ height:38, padding:'0 16px', borderRadius:9, border:'1px solid var(--border2)', background:'var(--surface)', color:'var(--text2)', fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontFamily:'inherit' }}>
            <Filter size={16} /> Filters
          </button>
          <button 
            onClick={handleExportBoardReport}
            style={{ height:38, padding:'0 18px', borderRadius:9, border:'none', background:'var(--ceo)', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontFamily:'inherit', boxShadow:'0 4px 12px rgba(168,85,247,0.25)' }}>
            <Download size={16} /> Export Board Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:12, marginBottom:12 }}>
        <StatCard icon={DollarSign} label="Total Revenue"  value={fmtCur(totRevenue)} change="12.4%" up={true} accentColor="var(--ceo)" />
        <StatCard icon={TrendingUp} label="Blended ROAS"   value={`${blendRoas}×`}     change="0.8×"  up={true} accentColor="var(--green)" />
        <StatCard icon={Users}      label="Total Team"     value={team.rows.length}   change="2"     up={true} accentColor="var(--admin)" />
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr',gap:12,marginBottom:12 }}>
        <Panel title="Revenue vs Ad Spend" subtitle="Monthly — 2026">
          <div style={{ padding:'12px 16px 14px' }}>
            <ResponsiveContainer width="100%" height={168}>
              <LineChart data={dynamicRevTrend.length > 0 ? dynamicRevTrend : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`} width={48} />
                <Tooltip contentStyle={ttpStyle} formatter={v=>[fmtCur(v)]} />
                <Line type="monotone" dataKey="revenue" name="Revenue"  stroke="var(--ceo)"  strokeWidth={2} dot={{ r:3,fill:'var(--ceo)'  }} />
                <Line type="monotone" dataKey="adspend" name="Ad Spend" stroke="var(--mkt)"  strokeWidth={2} dot={{ r:3,fill:'var(--mkt)'  }} strokeDasharray="5 5" />
                <Legend wrapperStyle={{ fontSize:11,color:'var(--text2)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12 }}>
        <Panel title="Top Clients" subtitle="Based on total revenue">
          {dynamicTopClients.map((c,i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <div style={{ width:28,height:28,borderRadius:'50%',background:'var(--surface2)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'var(--text2)',flexShrink:0 }}>{c.name[0]}</div>
                <div>
                  <div style={{ fontSize:12.5,fontWeight:500,color:'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize:11,color:'var(--text3)' }}>Client</div>
                </div>
              </div>
              <div style={{ textAlign:'right',flexShrink:0,marginLeft:12 }}>
                <div style={{ fontSize:13,fontWeight:700,color:'var(--text)',fontVariantNumeric:'tabular-nums' }}>{c.rev}</div>
                <div style={{ fontSize:11,color:'var(--green)' }}>Steady</div>
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Revenue Mix" subtitle="By product category">
          <div style={{ padding:'12px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie data={dynamicRevMix} dataKey="value" cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={3}>
                  {dynamicRevMix.map((d,i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={ttpStyle} formatter={v=>[`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding:'4px 16px 14px', display:'flex', flexDirection:'column', gap:5 }}>
            {dynamicRevMix.map(d => (
              <div key={d.name} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:12 }}>
                <div style={{ display:'flex',alignItems:'center',gap:7 }}>
                  <div style={{ width:8,height:8,borderRadius:2,background:d.color,flexShrink:0 }}
                  />
                  <span style={{ color:'var(--text2)' }}>{d.name}</span>
                </div>
                <span style={{ fontWeight:600,color:'var(--text)' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12 }}>
        <Panel title="Holdings">
          <div style={{ padding: '0 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <button 
              onClick={() => openAdd('invest')}
              style={{ width:'100%', height:34, borderRadius:6, border:'1px dashed var(--border2)', background:'var(--surface2)', color:'var(--text2)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              + Add New Position
            </button>
          </div>
          {invest.rows.map((item,i) => (
            <div key={i} 
              onDoubleClick={() => openEdit('invest', item)}
              style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 16px',borderBottom:'1px solid var(--border)', cursor:'pointer' }}
              title="Double click to edit">
              <div>
                <div style={{ fontSize:13,fontWeight:500,color:'var(--text)' }}>{item.name}</div>
                <div style={{ fontSize:11,color:'var(--text3)',marginTop:2 }}>{item.type}</div>
              </div>
              <div style={{ textAlign:'right',flexShrink:0,marginLeft:16, display:'flex', alignItems:'center', gap:12 }}>
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:700,color:'var(--text)' }}>{item.val}</div>
                  <div style={{ fontSize:11,marginTop:2,color:item.up==='Neutral'?'var(--amber)':item.up==='Yes'?'var(--green)':'var(--red)' }}>{item.note}</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); invest.remove(item.id) }}
                  style={{ background:'transparent', border:'none', color:'var(--red)', cursor:'pointer', padding:4, opacity:0.5 }}>
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Action Queue" tag={`${dcsns.rows.length} pending`} tagBg="rgba(239,68,68,0.12)" tagColor="#f87171">
          {dcsns.rows.map((d, i) => (
            <div key={i} style={{ display:'flex',gap:12,padding:'14px 16px',borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:d.dot,marginTop:5,flexShrink:0 }} />
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:5 }}>{d.title}</div>
                <div style={{ fontSize:12.5,color:'var(--text2)',lineHeight:1.6,marginBottom:10 }}>{d.body}</div>
                <div style={{ display:'flex',gap:7 }}>
                  <button 
                    onClick={() => dcsns.remove(d.id)}
                    style={{ height:28,padding:'0 14px',borderRadius:6,border:'none',background:'var(--green)',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit' }}>
                    Approve
                  </button>
                  <button style={{ height:28,padding:'0 14px',borderRadius:6,border:'1px solid var(--border2)',background:'transparent',color:'var(--text2)',fontSize:12,cursor:'pointer',fontFamily:'inherit' }}>
                    Defer
                  </button>
                  <button 
                    onClick={() => dcsns.remove(d.id)}
                    style={{ height:28,padding:'0 14px',borderRadius:6,border:'1px solid rgba(239,68,68,0.25)',background:'transparent',color:'var(--red)',fontSize:12,cursor:'pointer',fontFamily:'inherit' }}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Panel>
      </div>

      <div style={{ marginBottom:12 }}>
        <Panel title="Management Team" subtitle="Role-based access & permissions">
          <div style={{ padding: '0 16px 12px', borderBottom: '1px solid var(--border)', marginTop: 14 }}>
            <button 
              onClick={() => openAdd('team')}
              style={{ width:'100%', height:34, borderRadius:6, border:'1px dashed var(--border2)', background:'var(--surface2)', color:'var(--text2)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              + Onboard New Member
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>Member</th>
                  <th style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>Role</th>
                  <th style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>Status</th>
                  <th style={{ textAlign:'right', padding:'12px 16px' }} />
                </tr>
              </thead>
              <tbody>
                {team.rows.map(m => {
                  const isMatch = highlight && (m.name.toLowerCase().includes(highlight.toLowerCase()) || m.username.toLowerCase().includes(highlight.toLowerCase()));
                  return (
                    <tr key={m.id} style={{ 
                      borderBottom:'1px solid var(--border)',
                      background: isMatch ? 'rgba(168,85,247,0.1)' : 'transparent',
                      borderLeft: isMatch ? '3px solid var(--ceo)' : 'none'
                    }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--surface2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'var(--text2)' }}>{m.name[0]}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color: isMatch ? '#fff' : 'var(--text)' }}>{m.name}</div>
                            <div style={{ fontSize:11, color:'var(--text3)' }}>{m.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ fontSize:12, color:'var(--text2)', textTransform:'capitalize' }}>{m.role}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)' }} />
                          <span style={{ fontSize:12, color:'var(--text2)' }}>Active</span>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', textAlign:'right' }}>
                        <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                          <button onClick={() => openEdit('team', m)} style={{ padding:6, background:'transparent', border:'none', color:'var(--text3)', cursor:'pointer' }}><Plus size={14} /></button>
                          <button onClick={() => team.remove(m.id)} style={{ padding:6, background:'transparent', border:'none', color:'var(--red)', cursor:'pointer' }}><X size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {modal === 'invest' && (
        <DataModal 
          title={editing ? 'Edit Position' : 'Add Position'} 
          schema={FORM_SCHEMAS.investments} 
          initial={editing} 
          onSave={handleSave} 
          onClose={closeModal} 
        />
      )}
      {modal === 'dcsns' && (
        <DataModal 
          title={editing ? 'Edit Decision' : 'Add Decision'} 
          schema={FORM_SCHEMAS.strategic_decisions} 
          initial={editing} 
          onSave={handleSave} 
          onClose={closeModal} 
        />
      )}
      {modal === 'team' && (
        <DataModal 
          title={editing ? 'Edit Member' : 'Add Team Member'} 
          schema={FORM_SCHEMAS.users} 
          initial={editing} 
          onSave={handleSave} 
          onClose={closeModal} 
        />
      )}
    </div>
  )
}
