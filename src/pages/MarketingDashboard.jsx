import { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import { Target, TrendingUp, Users, BarChart2, DollarSign, Calendar, ChevronLeft, ChevronRight, Mail, MessageSquare, MousePointerClick, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import DataModal from '../components/DataModal'
import LiveBanner from '../components/LiveBanner'
import StatusBadge from '../components/StatusBadge'
import { useTable } from '../hooks/useTable'
import { initGoogleAds, initMetaAds, initCommunicationAds, FORM_SCHEMAS } from '../data/seedData'
import { exportToPDF, exportToExcel } from '../utils/exportUtils'

const G_COLS = [{ key:'campaign',label:'Campaign' },{ key:'type',label:'Type' },{ key:'budget',label:'Budget' },{ key:'spend',label:'Spend' },{ key:'clicks',label:'Clicks' },{ key:'conversions',label:'Conv.' },{ key:'revenue',label:'Revenue' },{ key:'status',label:'Status' }]
const M_COLS = [{ key:'campaign',label:'Campaign' },{ key:'type',label:'Type' },{ key:'budget',label:'Budget' },{ key:'spend',label:'Spend' },{ key:'reach',label:'Reach' },{ key:'conversions',label:'Conv.' },{ key:'revenue',label:'Revenue' },{ key:'status',label:'Status' }]
const C_COLS = [{ key:'campaign',label:'Campaign' },{ key:'type',label:'Type' },{ key:'budget',label:'Budget' },{ key:'spend',label:'Spend' },{ key:'reach',label:'Sent' },{ key:'conversions',label:'Conv.' },{ key:'revenue',label:'Revenue' },{ key:'status',label:'Status' }]

const fmtCur = v => { const n = Number(v||0); return n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}k`:`₹${n}` }
const fmtNum = v => Number(v||0).toLocaleString('en-IN')

const roiTrend = [
  { month:'Dec', google:3.8, meta:2.8 },{ month:'Jan', google:4.1, meta:3.0 },
  { month:'Feb', google:4.4, meta:3.2 },{ month:'Mar', google:4.6, meta:3.4 },
  { month:'Apr', google:4.7, meta:3.5 },{ month:'May', google:4.8, meta:3.6 },
]

// Email Marketing — monthly trend (static reference data)
const emailTrend = [
  { month:'Dec', sent:12400, opens:3472, revenue:42000 },
  { month:'Jan', sent:13800, opens:3864, revenue:48500 },
  { month:'Feb', sent:14200, opens:3976, revenue:52000 },
  { month:'Mar', sent:15600, opens:4368, revenue:58000 },
  { month:'Apr', sent:16200, opens:4536, revenue:63000 },
  { month:'May', sent:17800, opens:4984, revenue:71000 },
]

// WhatsApp Marketing — monthly trend (static reference data)
const waTrend = [
  { month:'Dec', sent:8200,  read:5180, revenue:28000 },
  { month:'Jan', sent:9400,  read:5929, revenue:32000 },
  { month:'Feb', sent:10200, read:6439, revenue:36000 },
  { month:'Mar', sent:11800, read:7440, revenue:41000 },
  { month:'Apr', sent:12400, read:7820, revenue:45000 },
  { month:'May', sent:13600, read:8574, revenue:51000 },
]

// (static Email/WA spend constants removed — values now come from communication_ads rows)

const ttpStyle = { background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:7, fontSize:12, color:'var(--text)', padding:'6px 10px' }

const RANGES = [
  { key:'all',  label:'All'    },
  { key:'today',label:'Today'  },
  { key:'7d',   label:'7 Days' },
  { key:'30d',  label:'30 Days'},
]

const filterRows = (rows, range, customDate) => {
  if (range === 'all') return rows
  const now = new Date()
  if (range === 'custom' && customDate) {
    const target = customDate.toDateString()
    return rows.filter(r => {
      const raw = r.created_at || r.date || ''
      if (!raw) return false
      return new Date(raw).toDateString() === target
    })
  }
  const days = range === 'today' ? 0 : range === '7d' ? 7 : 30
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - days)
  return rows.filter(r => {
    const raw = r.created_at || r.date || ''
    if (!raw) return range === 'all'
    const recordDate = new Date(raw)
    if (range === 'today') return recordDate.toDateString() === now.toDateString()
    return recordDate >= cutoff
  })
}

export default function MarketingDashboard({ activeModule = 'dashboard' }) {
  const [modal, setModal]         = useState(null)
  const [editing, setEditing]     = useState(null)
  const [highlight, setHighlight] = useState('')
  const [range, setRange]         = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)

  const handlePrevDate = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d)
    setRange('custom')
  }

  const handleNextDate = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(d)
    setRange('custom')
  }

  const google = useTable('google_ads', initGoogleAds)
  const meta   = useTable('meta_ads',   initMetaAds)
  const comm   = useTable('communication_ads', initCommunicationAds)

  useEffect(() => {
    const handleSearch = (e) => {
      const { module, query, id, record } = e.detail
      const marketingModules = ['google', 'meta', 'comm', 'roi', 'dashboard']
      // Accept any marketing-domain module regardless of current activeModule (timing-safe)
      if (!marketingModules.includes(module)) return

      setHighlight(query)
      setTimeout(() => setHighlight(''), 5000)

      if (id || record) {
        let tbl
        if (module === 'google') tbl = google
        else if (module === 'meta') tbl = meta
        else if (module === 'comm') tbl = comm

        if (tbl) {
          const row = tbl.rows.find(r => r.id === id) || record
          if (row) {
            setTimeout(() => {
              openEdit(module, row)
            }, 100)
          }
        }
      }
    }
    window.addEventListener('dashboard-search', handleSearch)
    return () => window.removeEventListener('dashboard-search', handleSearch)
  }, [activeModule, google, meta, comm])

  // Filtered row sets — react to date nav + range buttons
  const filteredGoogle = useMemo(() => filterRows(google.rows, range, selectedDate), [google.rows, range, selectedDate])
  const filteredMeta   = useMemo(() => filterRows(meta.rows,   range, selectedDate), [meta.rows,   range, selectedDate])
  const filteredComm   = useMemo(() => filterRows(comm.rows,   range, selectedDate), [comm.rows,   range, selectedDate])

  const gSpend = useMemo(() => filteredGoogle.reduce((s,r)=>s+Number(r.spend||0),0),   [filteredGoogle])
  const gRev   = useMemo(() => filteredGoogle.reduce((s,r)=>s+Number(r.revenue||0),0), [filteredGoogle])
  const mSpend = useMemo(() => filteredMeta.reduce((s,r)=>s+Number(r.spend||0),0),     [filteredMeta])
  const mRev   = useMemo(() => filteredMeta.reduce((s,r)=>s+Number(r.revenue||0),0),   [filteredMeta])
  const cSpend = useMemo(() => filteredComm.reduce((s,r)=>s+Number(r.spend||0),0),     [filteredComm])
  const cRev   = useMemo(() => filteredComm.reduce((s,r)=>s+Number(r.revenue||0),0),   [filteredComm])
  const totSpend  = gSpend + mSpend + cSpend   // cSpend already includes Email + WA + SMS rows
  const totRev    = gRev + mRev + cRev
  const blendRoas = totSpend > 0 ? (totRev/totSpend).toFixed(2) : '0.00'
  const gRoas     = gSpend  > 0 ? (gRev/gSpend).toFixed(2)    : '0.00'
  const mRoas     = mSpend  > 0 ? (mRev/mSpend).toFixed(2)    : '0.00'
  const cRoas     = cSpend  > 0 ? (cRev/cSpend).toFixed(2)    : '0.00'
  const totConv   = [...filteredGoogle,...filteredMeta,...filteredComm].reduce((s,r)=>s+Number(r.conversions||0),0)
  const totClicks = [...filteredGoogle,...filteredMeta,...filteredComm].reduce((s,r)=>s+Number(r.clicks||r.reach||0),0)

  // Split comm rows by channel type — drives Row 2 stat cards
  const waRows     = useMemo(() => filteredComm.filter(r => (r.type||'').toLowerCase().includes('whatsapp')), [filteredComm])
  const emailRows  = useMemo(() => filteredComm.filter(r => (r.type||'').toLowerCase().includes('email')),    [filteredComm])

  const waReach    = useMemo(() => waRows.reduce((s,r)=>s+Number(r.reach||0),0),   [waRows])
  const waSpendDyn = useMemo(() => waRows.reduce((s,r)=>s+Number(r.spend||0),0),   [waRows])
  const waRevDyn   = useMemo(() => waRows.reduce((s,r)=>s+Number(r.revenue||0),0), [waRows])

  const emailSpendDyn = useMemo(() => emailRows.reduce((s,r)=>s+Number(r.spend||0),0),       [emailRows])
  const emailRevDyn   = useMemo(() => emailRows.reduce((s,r)=>s+Number(r.revenue||0),0),     [emailRows])
  const emailReachDyn = useMemo(() => emailRows.reduce((s,r)=>s+Number(r.reach||0),0),       [emailRows])
  const emailConvDyn  = useMemo(() => emailRows.reduce((s,r)=>s+Number(r.conversions||0),0), [emailRows])
  // Click-through rate: conversions ÷ emails sent
  const emailCTR = emailReachDyn > 0 ? ((emailConvDyn / emailReachDyn) * 100).toFixed(1) : null
  // Cost per WA message
  const waCPM  = waReach > 0 ? (waSpendDyn / waReach).toFixed(2) : null
  const waConv = useMemo(() => waRows.reduce((s,r) => s + Number(r.conversions||0), 0), [waRows])
  const waRoas = waSpendDyn > 0 ? (waRevDyn / waSpendDyn).toFixed(2) : null

  // Per-campaign chart data — replaces static monthly trend arrays
  const emailChartData = useMemo(() => emailRows.map(r => ({
    name:        (r.campaign||'Campaign').split(' ').slice(0,2).join(' '),
    sent:        Number(r.reach||0),
    conversions: Number(r.conversions||0),
    revenue:     Number(r.revenue||0),
    spend:       Number(r.spend||0),
  })), [emailRows])

  const waChartData = useMemo(() => waRows.map(r => ({
    name:        (r.campaign||'Campaign').split(' ').slice(0,2).join(' '),
    reach:       Number(r.reach||0),
    conversions: Number(r.conversions||0),
    revenue:     Number(r.revenue||0),
    spend:       Number(r.spend||0),
  })), [waRows])

  const spendData = [
    { platform:'Google', spend:gSpend,        revenue:gRev        },
    { platform:'Meta',   spend:mSpend,        revenue:mRev        },
    { platform:'Email',  spend:emailSpendDyn, revenue:emailRevDyn },
    { platform:'WA',     spend:waSpendDyn,    revenue:waRevDyn    },
  ].filter(d => d.spend > 0 || d.revenue > 0)
  const donutData = [
    { name:'Google', value:gRev,        color:'#3b82f6' },
    { name:'Meta',   value:mRev,        color:'#a855f7' },
    { name:'Comms',  value:cRev,        color:'#14b8a6' },
    { name:'Email',  value:emailRevDyn, color:'#f59e0b' },
    { name:'WA',     value:waRevDyn,    color:'#22c55e' },
  ].filter(d => d.value > 0)

  const openAdd  = key => { setEditing(null); setModal(key) }
  const openEdit = (key, row) => { setEditing(row); setModal(key) }
  const closeModal = () => { setModal(null); setEditing(null) }
  const handleSave = async form => {
    try {
      let tbl
      if (modal === 'google') tbl = google
      else if (modal === 'meta') tbl = meta
      else if (modal === 'comm') tbl = comm
      
      if (!tbl) throw new Error(`Invalid modal state: ${modal}`)

      if (editing) await tbl.edit(editing.id, form)
      else         await tbl.add(form)
      closeModal()
    } catch (err) {
      alert(`Error saving: ${err.message}`)
    }
  }

  // ── Google Ads sub-page ──
  if (activeModule === 'google') {
    const gConv = filteredGoogle.reduce((s,r)=>s+Number(r.conversions||0),0)
    return (
      <div className="fade-up">
        <div style={{ marginBottom:18 }}><h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)' }}>Google Ads</h1><p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>Search · Display · Shopping campaigns</p></div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginBottom:14 }}>
          <StatCard icon={DollarSign} label="Total Spend"  value={fmtCur(gSpend)}   change="this period"        up={true} accentColor="var(--mkt)"   />
          <StatCard icon={TrendingUp} label="ROAS"         value={`${gRoas}×`}       change="return on ad spend" up={true} accentColor="var(--green)" />
          <StatCard icon={Target}     label="Conversions"  value={fmtNum(gConv)}     change="total conversions"  up={true} accentColor="var(--admin)" />
        </div>
        <Panel>
          <DataTable columns={G_COLS} rows={filteredGoogle} loading={google.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('google')} onEdit={row => openEdit('google', row)} onDelete={id => google.remove(id)}
            onExportPDF={() => exportToPDF('Google Ads', G_COLS, filteredGoogle)}
            onExportExcel={() => exportToExcel('Google Ads', G_COLS, filteredGoogle)} />
        </Panel>
        {modal && <DataModal title={editing?'Edit Campaign':'Add Campaign'} schema={FORM_SCHEMAS.google_ads} initial={editing} onSave={handleSave} onClose={closeModal} />}
      </div>
    )
  }

  // ── Meta Ads sub-page ──
  if (activeModule === 'meta') {
    const mConv = filteredMeta.reduce((s,r)=>s+Number(r.conversions||0),0)
    return (
      <div className="fade-up">
        <div style={{ marginBottom:18 }}><h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)' }}>Meta Ads</h1><p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>Facebook · Instagram campaigns</p></div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginBottom:14 }}>
          <StatCard icon={DollarSign} label="Total Spend"  value={fmtCur(mSpend)}   change="this period"        up={true} accentColor="var(--mkt)"   />
          <StatCard icon={TrendingUp} label="ROAS"         value={`${mRoas}×`}       change="return on ad spend" up={true} accentColor="var(--green)" />
          <StatCard icon={Users}      label="Conversions"  value={fmtNum(mConv)}     change="total conversions"  up={true} accentColor="var(--ceo)"   />
        </div>
        <Panel>
          <DataTable columns={M_COLS} rows={filteredMeta} loading={meta.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('meta')} onEdit={row => openEdit('meta', row)} onDelete={id => meta.remove(id)}
            onExportPDF={() => exportToPDF('Meta Ads', M_COLS, filteredMeta)}
            onExportExcel={() => exportToExcel('Meta Ads', M_COLS, filteredMeta)} />
        </Panel>
        {modal && <DataModal title={editing?'Edit Campaign':'Add Campaign'} schema={FORM_SCHEMAS.meta_ads} initial={editing} onSave={handleSave} onClose={closeModal} />}
      </div>
    )
  }

  // ── Comms sub-page ──
  if (activeModule === 'comm') {
    const totMessages = filteredComm.reduce((s,r)=>s+Number(r.reach||0),0)
    const cConv       = filteredComm.reduce((s,r)=>s+Number(r.conversions||0),0)
    return (
      <div className="fade-up">
        <div style={{ marginBottom:18 }}><h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)' }}>Communication Ads</h1><p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>WhatsApp · Email · SMS campaigns</p></div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginBottom:14 }}>
          <StatCard icon={Users}      label="Messages Sent" value={fmtNum(totMessages)} change="total reach"        up={true} accentColor="var(--teal)"  />
          <StatCard icon={TrendingUp} label="ROAS"          value={`${cRoas}×`}          change="return on ad spend" up={true} accentColor="var(--green)" />
          <StatCard icon={Target}     label="Conversions"   value={fmtNum(cConv)}         change="total conversions"  up={true} accentColor="var(--admin)" />
        </div>
        <Panel>
          <DataTable columns={C_COLS} rows={filteredComm} loading={comm.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('comm')} onEdit={row => openEdit('comm', row)} onDelete={id => comm.remove(id)}
            onExportPDF={() => exportToPDF('Communication Ads', C_COLS, filteredComm)}
            onExportExcel={() => exportToExcel('Communication Ads', C_COLS, filteredComm)} />
        </Panel>
        {modal === 'comm' && <DataModal title={editing?'Edit Campaign':'Add Campaign'} schema={FORM_SCHEMAS.communication_ads} initial={editing} onSave={handleSave} onClose={closeModal} />}
      </div>
    )
  }

  // ── ROI Analytics sub-page ──
  if (activeModule === 'roi') {
    return (
      <div className="fade-up">
        {/* Date filter bar — same as main dashboard */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', gap:2 }}>
              <button onClick={handlePrevDate} style={{ width:30, height:30, borderRadius:6, border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><ChevronLeft size={16} /></button>
              <button onClick={handleNextDate} style={{ width:30, height:30, borderRadius:6, border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><ChevronRight size={16} /></button>
            </div>
            <div style={{ position:'relative' }}>
              <button onClick={() => setShowCalendar(!showCalendar)} style={{ display:'flex', alignItems:'center', gap:8, padding:'0 12px', height:32, borderRadius:8, background:range==='custom'?'rgba(99,102,241,0.12)':'var(--surface2)', border:`1px solid ${range==='custom'?'rgba(99,102,241,0.4)':'var(--border2)'}`, color:'var(--text)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                <Calendar size={14} style={{ color:'#60a5fa' }} />
                {selectedDate.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                {range==='custom' && <span style={{ fontSize:10, color:'var(--mkt)', marginLeft:2 }}>●</span>}
              </button>
              <AnimatePresence>
                {showCalendar && (
                  <>
                    <div onClick={() => setShowCalendar(false)} style={{ position:'fixed', inset:0, zIndex:9998, background:'transparent' }} />
                    <motion.div initial={{ opacity:0, y:10, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.95 }} transition={{ duration:0.2, ease:'easeOut' }}
                      style={{ position:'absolute', top:'calc(100% + 8px)', left:0, zIndex:9999, background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:12, padding:10, boxShadow:'0 20px 40px rgba(0,0,0,0.6)', backdropFilter:'blur(20px)', width:220 }}>
                      <input type="date" value={selectedDate.toISOString().split('T')[0]}
                        onChange={e => { setSelectedDate(new Date(e.target.value)); setRange('custom'); setShowCalendar(false) }}
                        style={{ width:'100%', padding:'8px', borderRadius:6, background:'var(--surface3)', border:'1px solid var(--border)', color:'var(--text)', fontSize:12, outline:'none' }} />
                      <div style={{ marginTop:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
                        <button onClick={() => { setSelectedDate(new Date()); setRange('today'); setShowCalendar(false) }} style={{ padding:'6px', fontSize:10, background:'var(--surface3)', border:'1px solid var(--border)', color:'var(--text2)', borderRadius:4, cursor:'pointer' }}>Today</button>
                        <button onClick={() => setShowCalendar(false)} style={{ padding:'6px', fontSize:10, background:'var(--mkt)', border:'none', color:'#fff', borderRadius:4, cursor:'pointer' }}>Close</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div style={{ display:'flex', gap:3 }}>
            {RANGES.map(r => (
              <button key={r.key} onClick={() => { setRange(r.key); if(r.key==='today') setSelectedDate(new Date()) }}
                style={{ height:28, padding:'0 11px', borderRadius:6, cursor:'pointer', fontSize:11.5, fontWeight:500, fontFamily:'inherit', border:`1px solid ${range===r.key?'var(--border2)':'var(--border)'}`, background:range===r.key?'var(--surface2)':'transparent', color:range===r.key?'var(--text)':'var(--text2)', transition:'all 0.15s ease', boxShadow:range===r.key?'0 2px 8px rgba(139,92,246,0.2)':'none' }}>{r.label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)' }}>ROI Analytics</h1>
          <p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>Cross-channel return on investment analysis</p>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginBottom:14 }}>
          <StatCard icon={TrendingUp} label="Blended ROAS"  value={totSpend > 0 ? `${blendRoas}×` : '—'}   change={totSpend > 0 ? `Google ${gRoas}× · Meta ${mRoas}×` : 'no data for period'} up={true}  accentColor="var(--ceo)"   />
          <StatCard icon={DollarSign} label="Total Spend"   value={fmtCur(totSpend)} change={totSpend > 0 ? `Google ${fmtCur(gSpend)} · Meta ${fmtCur(mSpend)}` : 'no data for period'} up={true}  accentColor="var(--mkt)"   />
          <StatCard icon={BarChart2}  label="Total Revenue" value={fmtCur(totRev)}   change={totRev   > 0 ? `ROAS ${blendRoas}× blended return` : 'no data for period'} up={true}  accentColor="var(--green)" />
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
          <Panel title="ROAS Trend" subtitle="6-month historical by channel">
            <div style={{ padding:'12px 16px 14px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={roiTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}×`} />
                  <Tooltip contentStyle={ttpStyle} formatter={v=>[`${v}×`]} />
                  <Line type="monotone" dataKey="google" name="Google" stroke="var(--admin)" strokeWidth={2} dot={{ r:3,fill:'var(--admin)' }} />
                  <Line type="monotone" dataKey="meta"   name="Meta"   stroke="var(--ceo)"   strokeWidth={2} dot={{ r:3,fill:'var(--ceo)'   }} />
                  <Legend wrapperStyle={{ fontSize:11,color:'var(--text2)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Panel title="Spend vs Revenue" subtitle={spendData.length > 0 ? 'Channel comparison' : 'No campaign data for this period'}>
            <div style={{ padding:'12px 16px 14px' }}>
              {spendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={spendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="platform" tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>fmtCur(v)} width={48} />
                    <Tooltip contentStyle={ttpStyle} formatter={v=>[fmtCur(v)]} />
                    <Bar dataKey="spend"   name="Spend"   fill="var(--mkt)"   radius={[4,4,0,0]} maxBarSize={28} />
                    <Bar dataKey="revenue" name="Revenue" fill="var(--green)" radius={[4,4,0,0]} maxBarSize={28} />
                    <Legend wrapperStyle={{ fontSize:11,color:'var(--text2)' }} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text3)', fontSize:13 }}>
                  No campaign data for this period — try selecting All or 30 Days
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    )
  }

  // ── Main Marketing Dashboard ──
  return (
    <div className="fade-up">
      <LiveBanner />

      {/* Date navigation + range filter bar */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
        padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'relative', zIndex: 100
      }}>
        {/* Left: prev/next arrows + date pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            <button onClick={handlePrevDate} style={{
              width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleNextDate} style={{
              width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Date pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
                height: 32, borderRadius: 8,
                background: range === 'custom' ? 'rgba(99,102,241,0.12)' : 'var(--surface2)',
                border: `1px solid ${range === 'custom' ? 'rgba(99,102,241,0.4)' : 'var(--border2)'}`,
                color: 'var(--text)', fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Calendar size={14} style={{ color: '#60a5fa' }} />
              {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {range === 'custom' && <span style={{ fontSize:10, color:'var(--mkt)', marginLeft:2 }}>●</span>}
            </button>

            <AnimatePresence>
              {showCalendar && (
                <>
                  <div onClick={() => setShowCalendar(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'transparent' }} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 9999,
                      background: 'var(--surface2)', border: '1px solid var(--border2)',
                      borderRadius: 12, padding: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(20px)', width: 220
                    }}
                  >
                    <input
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => { setSelectedDate(new Date(e.target.value)); setRange('custom'); setShowCalendar(false) }}
                      style={{
                        width: '100%', padding: '8px', borderRadius: 6,
                        background: 'var(--surface3)', border: '1px solid var(--border)',
                        color: 'var(--text)', fontSize: 12, outline: 'none'
                      }}
                    />
                    <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                      <button onClick={() => { setSelectedDate(new Date()); setRange('today'); setShowCalendar(false) }}
                        style={{ padding: '6px', fontSize: 10, background: 'var(--surface3)', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 4, cursor: 'pointer' }}>
                        Today
                      </button>
                      <button onClick={() => setShowCalendar(false)}
                        style={{ padding: '6px', fontSize: 10, background: 'var(--mkt)', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer' }}>
                        Close
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: quick range buttons */}
        <div style={{ display: 'flex', gap: 3 }}>
          {RANGES.map(r => (
            <button key={r.key}
              onClick={() => { setRange(r.key); if (r.key === 'today') setSelectedDate(new Date()) }}
              style={{
                height: 28, padding: '0 11px', borderRadius: 6, cursor: 'pointer',
                fontSize: 11.5, fontWeight: 500, fontFamily: 'inherit',
                border: `1px solid ${range === r.key ? 'var(--border2)' : 'var(--border)'}`,
                background: range === r.key ? 'var(--surface2)' : 'transparent',
                color: range === r.key ? 'var(--text)' : 'var(--text2)',
                transition: 'all 0.15s ease',
                boxShadow: range === r.key ? '0 2px 8px rgba(139,92,246,0.2)' : 'none',
              }}
              onMouseEnter={e => { if (range !== r.key) { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='var(--border2)' } }}
              onMouseLeave={e => { if (range !== r.key) { e.currentTarget.style.color='var(--text2)'; e.currentTarget.style.borderColor='var(--border)' } }}
            >{r.label}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:18 }}>
        <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)',letterSpacing:'-0.02em' }}>Marketing Analytics</h1>
        <p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>Google Ads · Meta Ads · Email · WhatsApp performance overview</p>
      </div>

      {/* ── Row 1: Paid channel KPIs ── */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:10,marginBottom:10 }}>
        <StatCard icon={DollarSign} label="Total Ad Spend" value={fmtCur(totSpend)} change="all channels"             up={true}  accentColor="var(--mkt)"   />
        <StatCard icon={BarChart2}  label="Google Ads"    value={fmtCur(gRev)}                               change={`ROAS ${gRoas}× · spend ${fmtCur(gSpend)}`} up={true}  accentColor="var(--admin)" />
        <StatCard icon={TrendingUp} label="Meta Ads"      value={fmtCur(mRev)}                               change={`ROAS ${mRoas}× · spend ${fmtCur(mSpend)}`} up={true}  accentColor="var(--ceo)"  />
        <StatCard icon={Users}      label="Total Reach"   value={fmtNum(totClicks)}                          change="clicks + impressions"    up={true}  accentColor="var(--green)" />
      </div>

      {/* ── Row 2: Email + WhatsApp KPIs (live from communication_ads) ── */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:10,marginBottom:14 }}>
        <StatCard icon={Mail}              label="Email Revenue"       value={fmtCur(emailRevDyn)}
          change={emailRows.length > 0 ? `${emailRows.length} campaign${emailRows.length !== 1 ? 's' : ''}` : 'no email data'} up={true}  accentColor="var(--amber)"  />
        <StatCard icon={Eye}               label="Email Click Rate"    value={emailCTR !== null ? `${emailCTR}%` : '—'}
          change={emailCTR !== null ? `${emailConvDyn} conv. / ${fmtNum(emailReachDyn)} sent` : 'no email data'}               up={true}  accentColor="var(--green)"  />
        <StatCard icon={MessageSquare}     label="WhatsApp Reach"      value={fmtNum(waReach)}
          change={waRows.length > 0 ? `${waRows.length} campaign${waRows.length !== 1 ? 's' : ''}` : 'no WA data'}           up={true}  accentColor="var(--teal)"   />
        <StatCard icon={MousePointerClick} label="WhatsApp Spend"      value={fmtCur(waSpendDyn)}
          change={waCPM !== null ? `₹${waCPM} cost / msg` : 'no WA data'}                                                      up={true}  accentColor="var(--ceo)"    />
      </div>

      {/* ── Charts: Spend vs Revenue + Revenue Share ── */}
      <div style={{ display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:12,marginBottom:12 }}>
        <Panel title="Spend vs Revenue" subtitle="All channels — Google · Meta · Comms · Email · WhatsApp">
          <div style={{ padding:'12px 16px 14px' }}>
            <ResponsiveContainer width="100%" height={168}>
              <BarChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="platform" tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>fmtCur(v)} width={48} />
                <Tooltip contentStyle={ttpStyle} formatter={v=>[fmtCur(v)]} />
                <Bar dataKey="spend"   name="Spend"   fill="var(--mkt)"   radius={[4,4,0,0]} maxBarSize={28} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--green)"  radius={[4,4,0,0]} maxBarSize={28} />
                <Legend wrapperStyle={{ fontSize:11,color:'var(--text2)' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Revenue Share" subtitle="By platform">
          <div style={{ padding:'12px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={38} outerRadius={56} paddingAngle={3}>
                  {donutData.map((d,i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={ttpStyle} formatter={v=>[fmtCur(v)]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding:'4px 16px 14px', display:'flex', flexDirection:'column', gap:6 }}>
            {donutData.map(d => (
              <div key={d.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:d.color, flexShrink:0 }} />
                  <span style={{ color:'var(--text2)' }}>{d.name}</span>
                </div>
                <span style={{ fontWeight:600, color:'var(--text)', fontVariantNumeric:'tabular-nums' }}>{fmtCur(d.value)}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ── Email Marketing Performance + WhatsApp Marketing ── */}
      <div style={{ display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:12,marginBottom:12 }}>
        <Panel title="Email Marketing Performance"
               subtitle={emailRows.length > 0 ? `${emailRows.length} campaign${emailRows.length !== 1 ? 's' : ''} — sent vs conversions` : 'No email campaigns for this period'}>
          <div style={{ padding:'12px 16px 14px' }}>
            {emailChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={168}>
                <BarChart data={emailChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={40} />
                  <Tooltip contentStyle={ttpStyle} />
                  <Bar dataKey="sent"        name="Sent (Reach)" fill="var(--amber)"  radius={[4,4,0,0]} maxBarSize={28} />
                  <Bar dataKey="conversions" name="Conversions"  fill="var(--green)"  radius={[4,4,0,0]} maxBarSize={28} />
                  <Legend wrapperStyle={{ fontSize:11,color:'var(--text2)' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:168,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text3)',fontSize:13 }}>
                No email campaign data for this period
              </div>
            )}
          </div>
        </Panel>

        <Panel title="WhatsApp Marketing"
               subtitle={waRows.length > 0 ? `${waRows.length} campaign${waRows.length !== 1 ? 's' : ''} — live metrics` : 'No WhatsApp campaigns for this period'}>
          <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { label:'Total Campaigns',   val: fmtNum(waRows.length),   pct: null,                                                              color:'var(--text2)' },
              { label:'Messages Sent',     val: fmtNum(waReach),         pct: null,                                                              color:'var(--text2)' },
              { label:'Conversions',       val: fmtNum(waConv),          pct: waReach > 0 ? `${((waConv/waReach)*100).toFixed(1)}%` : null,     color:'var(--mkt)'   },
              { label:'Revenue',           val: fmtCur(waRevDyn),        pct: null,                                                              color:'var(--green)' },
              { label:'Total Spend',       val: fmtCur(waSpendDyn),      pct: null,                                                              color:'var(--text2)' },
              { label:'Cost / Message',    val: waCPM  ? `₹${waCPM}`   : '—', pct: null,                                                        color:'var(--text2)' },
              { label:'ROAS',              val: waRoas ? `${waRoas}×`   : '—', pct: null,                                                        color:'var(--green)' },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, color:'var(--text2)' }}>{row.label}</span>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {row.pct && (
                    <span style={{ fontSize:11, fontWeight:500, color:row.color, background:`${row.color}15`, borderRadius:4, padding:'2px 6px' }}>{row.pct}</span>
                  )}
                  <span style={{ fontSize:13, fontWeight:700, color:'var(--text)', fontVariantNumeric:'tabular-nums' }}>{row.val}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ── WhatsApp Campaign Chart + Email Revenue ── */}
      <div style={{ display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:12,marginBottom:12 }}>
        <Panel title="WhatsApp Campaign Performance"
               subtitle={waRows.length > 0 ? `${waRows.length} campaign${waRows.length !== 1 ? 's' : ''} — reach vs conversions` : 'No WhatsApp campaigns for this period'}>
          <div style={{ padding:'12px 16px 14px' }}>
            {waChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={168}>
                <BarChart data={waChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={40} />
                  <Tooltip contentStyle={ttpStyle} />
                  <Bar dataKey="reach"       name="Reach"       fill="var(--ceo)"   radius={[4,4,0,0]} maxBarSize={28} />
                  <Bar dataKey="conversions" name="Conversions" fill="var(--green)"  radius={[4,4,0,0]} maxBarSize={28} />
                  <Legend wrapperStyle={{ fontSize:11,color:'var(--text2)' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:168,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text3)',fontSize:13 }}>
                No WhatsApp campaign data for this period
              </div>
            )}
          </div>
        </Panel>

        <Panel title="Email Revenue by Campaign"
               subtitle={emailRows.length > 0 ? `${emailRows.length} campaign${emailRows.length !== 1 ? 's' : ''}` : 'No email campaigns for this period'}>
          <div style={{ padding:'12px 16px 14px' }}>
            {emailChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={168}>
                <BarChart data={emailChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>fmtCur(v)} width={48} />
                  <Tooltip contentStyle={ttpStyle} formatter={v=>[fmtCur(v)]} />
                  <Bar dataKey="revenue" name="Revenue" fill="var(--amber)" radius={[4,4,0,0]} maxBarSize={32} />
                  <Legend wrapperStyle={{ fontSize:11,color:'var(--text2)' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:168,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text3)',fontSize:13 }}>
                No email campaign data for this period
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* ── Paid Ad Campaign tables ── */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12 }}>
        <Panel title="Google Ads Campaigns" subtitle={range !== 'all' ? `Filtered — ${filteredGoogle.length} record${filteredGoogle.length !== 1 ? 's' : ''}` : `${google.rows.length} total`}>
          <DataTable columns={G_COLS} rows={filteredGoogle} loading={google.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('google')} onEdit={row => openEdit('google', row)} onDelete={id => google.remove(id)}
            onExportPDF={() => exportToPDF('Google Ads', G_COLS, filteredGoogle)}
            onExportExcel={() => exportToExcel('Google Ads', G_COLS, filteredGoogle)} />
        </Panel>
        <Panel title="Meta Ads Campaigns" subtitle={range !== 'all' ? `Filtered — ${filteredMeta.length} record${filteredMeta.length !== 1 ? 's' : ''}` : `${meta.rows.length} total`}>
          <DataTable columns={M_COLS} rows={filteredMeta} loading={meta.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('meta')} onEdit={row => openEdit('meta', row)} onDelete={id => meta.remove(id)}
            onExportPDF={() => exportToPDF('Meta Ads', M_COLS, filteredMeta)}
            onExportExcel={() => exportToExcel('Meta Ads', M_COLS, filteredMeta)} />
        </Panel>
      </div>

      {/* ── KPI metric cards ── */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10 }}>
        {[
          { label:'Impression Share',      val:'62.4%',  delta:'↑ 4.2pp vs last month',      up:true  },
          { label:'Click-through Rate',    val:'3.84%',  delta:'↑ 0.4pp above benchmark',    up:true  },
          { label:'Cost per Click',        val:'₹37.2',  delta:'↓ ₹2.4 improvement',          up:true  },
          { label:'Landing Page CVR',      val:'8.2%',   delta:'↑ 1.1pp this month',          up:true  },
          { label:'Email Open Rate',       val:'28.0%',  delta:'Industry avg: 21% — +7pp',    up:true  },
          { label:'WhatsApp Read Rate',    val:'63.1%',  delta:'↑ 8.9pp vs prior campaign',   up:true  },
          { label:'Email Click Rate',      val:'7.0%',   delta:'4,984 opens → 1,246 clicks',  up:true  },
          { label:'WA Conversion Rate',    val:'9.5%',   delta:'1,286 orders from campaign',  up:true  },
          { label:'Email Spend (May)',      val:'₹18.5k', delta:'ROI: 3.8× on ₹71k revenue',  up:true  },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 14px' }}>
            <div style={{ fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:'Syne,sans-serif',fontSize:19,fontWeight:700,color:'var(--text)',marginBottom:4 }}>{k.val}</div>
            <div style={{ fontSize:11.5,color:k.up?'var(--green)':'var(--amber)' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {modal && (
        <DataModal
          title={editing ? 'Edit Campaign' : 'Add Campaign'}
          schema={FORM_SCHEMAS[modal === 'google' ? 'google_ads' : modal === 'meta' ? 'meta_ads' : 'communication_ads']}
          initial={editing} onSave={handleSave} onClose={closeModal}
        />
      )}
    </div>
  )
}
