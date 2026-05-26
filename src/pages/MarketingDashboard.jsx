import { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import { Target, TrendingUp, Users, BarChart2, DollarSign } from 'lucide-react'
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

const ttpStyle = { background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:7, fontSize:12, color:'var(--text)', padding:'6px 10px' }

export default function MarketingDashboard({ activeModule = 'dashboard' }) {
  const [modal, setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [highlight, setHighlight] = useState('')

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

  const gSpend = useMemo(() => google.rows.reduce((s,r)=>s+Number(r.spend||0),0), [google.rows])
  const gRev   = useMemo(() => google.rows.reduce((s,r)=>s+Number(r.revenue||0),0), [google.rows])
  const mSpend = useMemo(() => meta.rows.reduce((s,r)=>s+Number(r.spend||0),0), [meta.rows])
  const mRev   = useMemo(() => meta.rows.reduce((s,r)=>s+Number(r.revenue||0),0), [meta.rows])
  const cSpend = useMemo(() => comm.rows.reduce((s,r)=>s+Number(r.spend||0),0), [comm.rows])
  const cRev   = useMemo(() => comm.rows.reduce((s,r)=>s+Number(r.revenue||0),0), [comm.rows])
  const totSpend  = gSpend + mSpend + cSpend
  const totRev    = gRev + mRev + cRev
  const blendRoas = totSpend > 0 ? (totRev/totSpend).toFixed(2) : '0.00'
  const totConv   = [...google.rows,...meta.rows,...comm.rows].reduce((s,r)=>s+Number(r.conversions||0),0)
  const totClicks = [...google.rows,...meta.rows,...comm.rows].reduce((s,r)=>s+Number(r.clicks||r.reach||0),0)

  const spendData = [
    { platform:'Google', spend:gSpend, revenue:gRev },
    { platform:'Meta',   spend:mSpend, revenue:mRev },
    { platform:'Comms',  spend:cSpend, revenue:cRev },
  ]
  const donutData = [
    { name:'Google', value:gRev, color:'#3b82f6' },
    { name:'Meta',   value:mRev, color:'#a855f7'  },
    { name:'Comms',  value:cRev, color:'#14b8a6'  },
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
    const gRoas = gSpend > 0 ? (gRev/gSpend).toFixed(2) : '0'
    return (
      <div className="fade-up">
        <div style={{ marginBottom:18 }}><h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)' }}>Google Ads</h1><p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>Search · Display · Shopping campaigns</p></div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginBottom:14 }}>
          <StatCard icon={DollarSign} label="Total Spend"  value={fmtCur(gSpend)} change="this period" up={true}  accentColor="var(--mkt)"   />
          <StatCard icon={TrendingUp} label="ROAS"         value={`${gRoas}×`}    change="return on ad spend" up={true} accentColor="var(--green)" />
          <StatCard icon={Target}     label="Conversions"  value={fmtNum(google.rows.reduce((s,r)=>s+Number(r.conversions||0),0))} change="total conversions" up={true} accentColor="var(--admin)" />
        </div>
        <Panel>
          <DataTable columns={G_COLS} rows={google.rows} loading={google.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('google')} onEdit={row => openEdit('google', row)} onDelete={id => google.remove(id)}
            onExportPDF={() => exportToPDF('Google Ads', G_COLS, google.rows)}
            onExportExcel={() => exportToExcel('Google Ads', G_COLS, google.rows)} />
        </Panel>
        {modal && <DataModal title={editing?'Edit Campaign':'Add Campaign'} schema={FORM_SCHEMAS.google_ads} initial={editing} onSave={handleSave} onClose={closeModal} />}
      </div>
    )
  }

  // ── Meta Ads sub-page ──
  if (activeModule === 'meta') {
    const mRoas = mSpend > 0 ? (mRev/mSpend).toFixed(2) : '0'
    return (
      <div className="fade-up">
        <div style={{ marginBottom:18 }}><h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)' }}>Meta Ads</h1><p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>Facebook · Instagram campaigns</p></div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginBottom:14 }}>
          <StatCard icon={DollarSign} label="Total Spend"  value={fmtCur(mSpend)} change="this period" up={true}  accentColor="var(--mkt)"   />
          <StatCard icon={TrendingUp} label="ROAS"         value={`${mRoas}×`}    change="return on ad spend" up={true} accentColor="var(--green)" />
          <StatCard icon={Users}      label="Conversions"  value={fmtNum(meta.rows.reduce((s,r)=>s+Number(r.conversions||0),0))} change="total conversions" up={true} accentColor="var(--ceo)" />
        </div>
        <Panel>
          <DataTable columns={M_COLS} rows={meta.rows} loading={meta.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('meta')} onEdit={row => openEdit('meta', row)} onDelete={id => meta.remove(id)}
            onExportPDF={() => exportToPDF('Meta Ads', M_COLS, meta.rows)}
            onExportExcel={() => exportToExcel('Meta Ads', M_COLS, meta.rows)} />
        </Panel>
        {modal && <DataModal title={editing?'Edit Campaign':'Add Campaign'} schema={FORM_SCHEMAS.meta_ads} initial={editing} onSave={handleSave} onClose={closeModal} />}
      </div>
    )
  }

  // ── Comms sub-page ──
  if (activeModule === 'comm') {
    const cRoas = cSpend > 0 ? (cRev/cSpend).toFixed(2) : '0'
    const totMessages = comm.rows.reduce((s,r)=>s+Number(r.reach||0),0)
    return (
      <div className="fade-up">
        <div style={{ marginBottom:18 }}><h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)' }}>Communication Ads</h1><p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>WhatsApp · Email · SMS campaigns</p></div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginBottom:14 }}>
          <StatCard icon={Users}      label="Messages Sent" value={fmtNum(totMessages)}  change="total reach" up={true} accentColor="var(--teal)"  />
          <StatCard icon={TrendingUp} label="ROAS"          value={`${cRoas}×`}   change="return on ad spend"  up={true} accentColor="var(--green)" />
          <StatCard icon={Target}     label="Conversions"   value={fmtNum(comm.rows.reduce((s,r)=>s+Number(r.conversions||0),0))}   change="total conversions" up={true} accentColor="var(--admin)" />
        </div>
        <Panel>
          <DataTable columns={C_COLS} rows={comm.rows} loading={comm.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('comm')} onEdit={row => openEdit('comm', row)} onDelete={id => comm.remove(id)}
            onExportPDF={() => exportToPDF('Communication Ads', C_COLS, comm.rows)}
            onExportExcel={() => exportToExcel('Communication Ads', C_COLS, comm.rows)} />
        </Panel>
        {modal === 'comm' && <DataModal title={editing?'Edit Campaign':'Add Campaign'} schema={FORM_SCHEMAS.communication_ads} initial={editing} onSave={handleSave} onClose={closeModal} />}
      </div>
    )
  }

  // ── ROI Analytics sub-page ──
  if (activeModule === 'roi') {
    return (
      <div className="fade-up">
        <div style={{ marginBottom:18 }}><h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)' }}>ROI Analytics</h1><p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>Cross-channel return on investment analysis</p></div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginBottom:14 }}>
          <StatCard icon={TrendingUp} label="Blended ROAS"  value={`${blendRoas}×`}  change="all channels combined" up={true}  accentColor="var(--ceo)"   />
          <StatCard icon={DollarSign} label="Total Spend"   value={fmtCur(totSpend)} change="Google + Meta"         up={true}  accentColor="var(--mkt)"   />
          <StatCard icon={BarChart2}  label="Total Revenue" value={fmtCur(totRev)}   change="from ad channels"      up={true}  accentColor="var(--green)" />
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
          <Panel title="ROAS Trend" subtitle="6-month view by channel">
            <div style={{ padding:'12px 16px 14px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={roiTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}×`} />
                  <Tooltip contentStyle={ttpStyle} formatter={v=>[`${v}×`]} />
                  <Line type="monotone" dataKey="google" name="Google" stroke="var(--admin)"  strokeWidth={2} dot={{ r:3,fill:'var(--admin)'  }} />
                  <Line type="monotone" dataKey="meta"   name="Meta"   stroke="var(--ceo)"    strokeWidth={2} dot={{ r:3,fill:'var(--ceo)'    }} />
                  <Legend wrapperStyle={{ fontSize:11,color:'var(--text2)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Panel title="Spend vs Revenue" subtitle="Channel comparison">
            <div style={{ padding:'12px 16px 14px' }}>
              <ResponsiveContainer width="100%" height={200}>
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
        </div>
      </div>
    )
  }

  // ── Main Marketing Dashboard ──
  return (
    <div className="fade-up">
      <LiveBanner />
      <div style={{ marginBottom:18 }}>
        <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,color:'var(--text)',letterSpacing:'-0.02em' }}>Marketing Analytics</h1>
        <p style={{ fontSize:12,color:'var(--text2)',marginTop:3 }}>Google Ads · Meta Ads · Communications performance overview</p>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:10,marginBottom:14 }}>
        <StatCard icon={DollarSign} label="Total Ad Spend"    value={fmtCur(totSpend)}      change="Google + Meta"       up={true}  accentColor="var(--mkt)"   />
        <StatCard icon={TrendingUp} label="Blended ROAS"       value={`${blendRoas}×`}        change="avg all channels"    up={true}  accentColor="var(--green)" />
        <StatCard icon={Target}     label="Total Conversions"  value={fmtNum(totConv)}        change="all campaigns"       up={true}  accentColor="var(--admin)" />
        <StatCard icon={Users}      label="Total Reach"        value={fmtNum(totClicks)}      change="clicks + impressions" up={true}  accentColor="var(--ceo)"   />
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:12,marginBottom:12 }}>
        <Panel title="Spend vs Revenue" subtitle="By channel">
          <div style={{ padding:'12px 16px 14px' }}>
            <ResponsiveContainer width="100%" height={168}>
              <BarChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="platform" tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11,fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>fmtCur(v)} width={48} />
                <Tooltip contentStyle={ttpStyle} formatter={v=>[fmtCur(v)]} />
                <Bar dataKey="spend"   name="Spend"   fill="var(--mkt)"   radius={[4,4,0,0]} maxBarSize={32} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--green)"  radius={[4,4,0,0]} maxBarSize={32} />
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

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12 }}>
        <Panel title="Google Ads Campaigns">
          <DataTable columns={G_COLS} rows={google.rows} loading={google.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('google')} onEdit={row => openEdit('google', row)} onDelete={id => google.remove(id)} />
        </Panel>
        <Panel title="Meta Ads Campaigns">
          <DataTable columns={M_COLS} rows={meta.rows} loading={meta.loading}
            highlightQuery={highlight}
            onAdd={() => openAdd('meta')} onEdit={row => openEdit('meta', row)} onDelete={id => meta.remove(id)} />
        </Panel>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10 }}>
        {[
          { label:'Impression Share',   val:'62.4%',  delta:'↑ 4.2pp vs last month',    up:true  },
          { label:'Click-through Rate', val:'3.84%',  delta:'↑ 0.4pp above benchmark',  up:true  },
          { label:'Cost per Click',     val:'₹37.2',  delta:'↓ ₹2.4 improvement',        up:true  },
          { label:'Landing Page CVR',   val:'8.2%',   delta:'↑ 1.1pp this month',        up:true  },
          { label:'Email Open Rate',    val:'28.4%',  delta:'Industry avg: 21%',          up:true  },
          { label:'WhatsApp Read Rate', val:'54.1%',  delta:'↑ 6.4pp vs prior campaign', up:true  },
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
