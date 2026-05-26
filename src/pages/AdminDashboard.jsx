import { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend, AreaChart, Area } from 'recharts'
import { DollarSign, ShoppingBag, Clock, AlertTriangle, TrendingUp, Zap, ArrowUpRight, ArrowDownRight, Calendar, ChevronLeft, ChevronRight, Clock8 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import DataModal from '../components/DataModal'
import LiveBanner from '../components/LiveBanner'
import { useTable } from '../hooks/useTable'
import { initSales, initInventory, initPayments, initReceivables, initFabric, salesChartData, FORM_SCHEMAS } from '../data/seedData'
import { exportToPDF, exportToExcel } from '../utils/exportUtils'

const COLS = {
  sales:       [{ key:'date',label:'Date' },{ key:'client',label:'Client' },{ key:'product',label:'Product' },{ key:'qty',label:'Qty' },{ key:'amount',label:'Amount' },{ key:'status',label:'Status' }],
  inventory: [
    { key:'name',label:'Item' },
    { key:'sku',label:'SKU' },
    { key:'barcode',label:'Barcode' },
    { key:'category',label:'Category' },
    { key:'selling_price',label:'Selling Price' },
    { key:'warehouse_loc',label:'Warehouse' },
    { key:'units',label:'Units' },
    { key:'unit',label:'Type' },
    { key:'reorder_level',label:'Reorder Level' },
    { key:'purchase_price',label:'₹/Unit' },
    { key:'supplier_name',label:'Supplier' },
    { key:'contact_num',label:'Contact' },
    { key:'stock_status',label:'Status' }
  ],
  payments:    [
    { key:'supplier',label:'Supplier' },
    { key:'invoice',label:'Invoice' },
    { key:'invoice_date',label:'Inv Date' },
    { key:'paid_date',label:'Paid Date' },
    { key:'transaction_date',label:'Txn Date' },
    { key:'total_amount',label:'Total' },
    { key:'paid_amount',label:'Paid' },
    { key:'pending_amount',label:'Pending' },
    { key:'payment_method',label:'Method' },
    { key:'status',label:'Status' }
  ],
  receivables: [{ key:'client',label:'Client' },{ key:'invoice',label:'Invoice' },{ key:'amount',label:'Amount' },{ key:'due',label:'Due Date' },{ key:'status',label:'Status' }],
  fabric:      [{ key:'fabric',label:'Fabric' },{ key:'qty',label:'Qty' },{ key:'supplier',label:'Supplier' },{ key:'order_date',label:'Ordered' },{ key:'delivery',label:'Delivery' },{ key:'amount',label:'Amount' },{ key:'status',label:'Status' }],
}

const PAGE_LABELS = {
  sales: 'Sales Entry', inventory: 'Inventory', payments: 'Payments',
  receivables: 'Receivables', fabric: 'Fabric Orders',
}
const PAGE_SUBS = {
  sales: 'Record and manage all sales transactions',
  inventory: 'Track stock levels, costs, and reorder points',
  payments: 'Manage supplier invoices and payment status',
  receivables: 'Track outstanding client payments',
  fabric: 'Manage active purchase orders',
}

const fmtCur = v => { const n = Number(v || 0); return n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}k` : `₹${n}` }

const filterRows = (rows, range, customDate) => {
  if (range === 'all') return rows
  const now = new Date(); now.setHours(0,0,0,0)
  
  if (range === 'custom' && customDate) {
    const target = customDate.toDateString()
    return rows.filter(r => {
      const raw = r.created_at || r.date || r.due || r.order_date || ''
      if (!raw) return false
      return new Date(raw).toDateString() === target
    })
  }

  const days = range === 'today' ? 0 : range === '7d' ? 7 : 30
  const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - days)
  return rows.filter(r => {
    const raw = r.created_at || r.date || r.due || r.order_date || ''
    if (!raw) return range === 'all'
    const recordDate = new Date(raw)
    if (range === 'today') {
      return recordDate.toDateString() === now.toDateString()
    }
    return recordDate >= cutoff
  })
}

const AnimatedCounter = ({ value, prefix = '₹', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = Number(value)
    if (start === end) return
    
    let totalDuration = 1000
    let increment = end / (totalDuration / 16)
    
    let timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(start)
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [value])

  const formatted = displayValue >= 100000 
    ? `${(displayValue/100000).toFixed(1)}L` 
    : displayValue >= 1000 
      ? `${(displayValue/1000).toFixed(0)}k` 
      : Math.floor(displayValue)

  return <span>{prefix}{formatted}{suffix}</span>
}

export default function AdminDashboard({ activeModule = 'dashboard' }) {
  const [range, setRange]   = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [modal, setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [highlight, setHighlight] = useState('')

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

  const sales  = useTable('sales_entries',    initSales)
  const inv    = useTable('inventory',         initInventory)
  const pay    = useTable('supplier_payments', initPayments)
  const recv   = useTable('receivables',       initReceivables)
  const fabric = useTable('fabric_orders',     initFabric)

  useEffect(() => {
    const handleSearch = (e) => {
      const { module, query, id, record } = e.detail
      // Accept events for ANY admin module — AdminDashboard is never unmounted between
      // sub-pages so highlight state persists even when navigating from dashboard → payments etc.
      const adminModules = ['sales', 'inventory', 'payments', 'receivables', 'fabric', 'dashboard']
      if (!adminModules.includes(module)) return

      setHighlight(query)
      setTimeout(() => setHighlight(''), 5000)

      if (id || record) {
        const localTables = { sales, inventory: inv, payments: pay, receivables: recv, fabric }
        const tbl = localTables[module]
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
  }, [activeModule, sales, inv, pay, recv, fabric])

  const tables = { sales, inventory: inv, payments: pay, receivables: recv, fabric }

  const filteredSales = useMemo(() => filterRows(sales.rows, range, selectedDate), [sales.rows, range, selectedDate])
  const filteredPay = useMemo(() => filterRows(pay.rows, range, selectedDate), [pay.rows, range, selectedDate])
  const filteredRecv = useMemo(() => filterRows(recv.rows, range, selectedDate), [recv.rows, range, selectedDate])
  const filteredFab = useMemo(() => filterRows(fabric.rows, range, selectedDate), [fabric.rows, range, selectedDate])

  const dynamicWeeklyTrend = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dataMap = { 'Mon': {rev:0, ord:0, prof:0}, 'Tue': {rev:0, ord:0, prof:0}, 'Wed': {rev:0, ord:0, prof:0}, 'Thu': {rev:0, ord:0, prof:0}, 'Fri': {rev:0, ord:0, prof:0}, 'Sat': {rev:0, ord:0, prof:0}, 'Sun': {rev:0, ord:0, prof:0} }
    
    filteredSales.forEach(r => {
      const d = new Date(r.date || r.created_at)
      const dayName = days[d.getDay()]
      if (dataMap[dayName]) {
        dataMap[dayName].rev += Number(r.amount || 0)
        dataMap[dayName].ord += 1
        dataMap[dayName].prof += Number(r.amount || 0) * 0.38 // Assuming 38% margin from KPIs
      }
    })

    const hasData = Object.values(dataMap).some(v => v.rev > 0)
    if (!hasData && range === 'all') {
      return salesChartData.map(d => ({ day: d.day, sales: d.sales, orders: Math.round(d.sales/1000), profit: d.sales * 0.38 }))
    }

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      sales: dataMap[day].rev,
      orders: dataMap[day].ord,
      profit: Math.floor(dataMap[day].prof)
    }))
  }, [filteredSales, range])

  const aiInsights = useMemo(() => {
    const insights = {
      today: [
        "Sales velocity is up 12% compared to yesterday's morning session.",
        "3 high-priority orders were completed in the last 4 hours.",
        "UPI remains the preferred payment method for today's transactions."
      ],
      '7d': [
        "Meta Ads generated the highest ROAS (4.9x) this week.",
        "Saturday saw a peak revenue of ₹88k, driven by Ethnic Trends.",
        "Inventory turnover for Cotton Twill increased by 0.5x this week."
      ],
      '30d': [
        "Monthly revenue is on track to hit ₹18.4L (↑ 8% vs target).",
        "Pending receivables increased by 5% this month; follow-up advised.",
        "Silk category products show a 22% higher margin than synthetics."
      ],
      all: [
        "Overall gross margin is stable at 38.4% across all time.",
        "Fashionista Ltd remains your top client by lifetime value.",
        "Average order fulfillment rate is maintaining a high 97.2%."
      ]
    }
    return insights[range] || insights.all
  }, [range])

  const openAdd  = key => { setEditing(null); setModal(key) }
  const openEdit = (key, row) => { setEditing(row); setModal(key) }
  const closeModal = () => { setModal(null); setEditing(null) }

  const handleSave = async form => {
    try {
      const tbl = tables[modal]
      if (!tbl) throw new Error(`Invalid modal state: ${modal}`)
      
      if (editing) await tbl.edit(editing.id, form)
      else         await tbl.add(form)
      closeModal()
    } catch (err) {
      alert(`Error saving: ${err.message}`)
    }
  }

  const totRevenue    = filteredSales.reduce((s, r) => s + Number(r.amount || 0), 0)
  const totOrders     = filteredSales.length
  const pendingPay    = filteredPay.filter(r => r.status === 'Pending' || r.status === 'Overdue').reduce((s, r) => s + Number(r.amount || 0), 0)
  const lowStock      = inv.rows.filter(r => r.status === 'Low Stock' || r.status === 'Critical').length
  const collectedRecv = filteredRecv.filter(r => r.status === 'Received').reduce((s, r) => s + Number(r.amount || 0), 0)
  const pendingRecv   = filteredRecv.filter(r => r.status !== 'Received').reduce((s, r) => s + Number(r.amount || 0), 0)
  const totalRecv     = collectedRecv + pendingRecv

  const ttpStyle = { background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 7, fontSize: 12, color: 'var(--text)', padding: '6px 10px' }

  // ─── Sub-page (non-dashboard) ───────────────────────────
  if (activeModule !== 'dashboard') {
    const tbl  = tables[activeModule]
    const cols = COLS[activeModule]
    const schemaKey = activeModule === 'sales' ? 'sales_entries' : activeModule === 'payments' ? 'supplier_payments' : activeModule === 'fabric' ? 'fabric_orders' : activeModule
    if (!tbl || !cols) return null
    return (
      <div className="fade-up">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'var(--text)' }}>{PAGE_LABELS[activeModule]}</h1>
          <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>{PAGE_SUBS[activeModule]}</p>
        </div>
        <Panel>
          <DataTable
            columns={cols} rows={tbl.rows} loading={tbl.loading}
            highlightQuery={highlight}
            onAdd={FORM_SCHEMAS[schemaKey] ? () => openAdd(activeModule) : undefined}
            onEdit={FORM_SCHEMAS[schemaKey] ? row => openEdit(activeModule, row) : undefined}
            onDelete={id => tbl.remove(id)}
            onExportPDF={() => exportToPDF(PAGE_LABELS[activeModule], cols, tbl.rows)}
            onExportExcel={() => exportToExcel(PAGE_LABELS[activeModule], cols, tbl.rows)}
          />
        </Panel>
        {modal && (
          <DataModal
            title={editing ? `Edit ${PAGE_LABELS[activeModule]}` : `Add ${PAGE_LABELS[activeModule]}`}
            schema={FORM_SCHEMAS[schemaKey]}
            initial={editing}
            onSave={handleSave}
            onClose={closeModal}
          />
        )}
      </div>
    )
  }

  // ─── Dashboard ───────────────────────────────────────────
  const RANGES = [
    { key: 'today', label: 'Today' },
    { key: '7d',    label: '7 Days' },
    { key: '30d',   label: '30 Days' },
    { key: 'all',   label: 'All Time' },
  ]

  return (
    <div className="fade-up">
      <LiveBanner />

      {/* Page header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18, gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'var(--text)', letterSpacing:'-0.02em' }}>Admin Dashboard</h1>
          <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>Operations overview — Sales · Inventory · Payments · Receivables</p>
        </div>
        <div style={{ display:'flex', gap:3, flexShrink:0 }}>
          {RANGES.map(r => (
            <button key={r.key} onClick={() => { setRange(r.key); if(r.key === 'today') setSelectedDate(new Date()); }}
              style={{
                height:28, padding:'0 11px', borderRadius:6, cursor:'pointer',
                fontSize:11.5, fontWeight:500, fontFamily:'inherit',
                border:`1px solid ${range === r.key ? 'var(--border2)' : 'var(--border)'}`,
                background: range === r.key ? 'var(--surface2)' : 'transparent',
                color: range === r.key ? 'var(--text)' : 'var(--text2)',
                transition:'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: range === r.key ? '0 2px 8px rgba(59,130,246,0.2)' : 'none',
              }}
              onMouseEnter={e => { if(range !== r.key) { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='var(--border2)'; } }}
              onMouseLeave={e => { if(range !== r.key) { e.currentTarget.style.color='var(--text2)'; e.currentTarget.style.borderColor='var(--border)'; } }}
            >{r.label}</button>
          ))}
        </div>
      </div>

      {/* Modern Date Filter Section */}
      <div style={{ 
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, 
        padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', backdropFilter: 'blur(10px)',
        position: 'relative', zIndex: 100 // Ensure parent doesn't trap the popup
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', 
                height: 32, borderRadius: 8, background: 'var(--surface2)', 
                border: '1px solid var(--border2)', color: 'var(--text)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Calendar size={14} className="text-blue-400" />
              {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </button>
            
            <AnimatePresence>
              {showCalendar && (
                <>
                  {/* Backdrop for closing when clicking outside */}
                  <div 
                    onClick={() => setShowCalendar(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'transparent' }}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
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
                      onChange={(e) => {
                        setSelectedDate(new Date(e.target.value))
                        setRange('custom')
                        setShowCalendar(false)
                      }}
                      style={{ 
                        width: '100%', padding: '8px', borderRadius: 6, 
                        background: 'var(--surface3)', border: '1px solid var(--border)',
                        color: 'var(--text)', fontSize: 12, outline: 'none'
                      }}
                    />
                    <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                      <button onClick={() => { setSelectedDate(new Date()); setRange('today'); setShowCalendar(false); }} style={{ padding: '6px', fontSize: 10, background: 'var(--surface3)', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 4, cursor: 'pointer' }}>Today</button>
                      <button onClick={() => setShowCalendar(false)} style={{ padding: '6px', fontSize: 10, background: 'var(--admin)', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer' }}>Close</button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 32, borderRadius: 20, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Clock8 size={13} className="text-blue-400" />
            <span style={{ fontSize: 11, color: 'var(--text)', fontWeight: 500 }}>
              {range === 'all' ? 'Historical View' : range === 'today' ? 'Today\'s Activity' : range === '7d' ? 'Weekly Snapshot' : range === '30d' ? 'Monthly Analysis' : 'Custom Selection'}
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:10, marginBottom:14 }}>
        <StatCard icon={DollarSign}    label="Total Revenue"     value={<AnimatedCounter value={totRevenue} />} change="↑ 12.4%"        up={true}  accentColor="var(--admin)" />
        <StatCard icon={ShoppingBag}   label="Active Orders"     value={<AnimatedCounter value={totOrders} prefix="" />}  change="in this period"               up={true}  accentColor="var(--green)" />
        <StatCard icon={Clock}         label="Pending Payments"  value={<AnimatedCounter value={pendingPay} />} change="to suppliers"                 up={false} accentColor="var(--amber)" />
        <StatCard icon={AlertTriangle} label="Low Stock Items"   value={<AnimatedCounter value={lowStock} prefix="" />}   change="need reorder"                 up={false} accentColor="var(--red)"   />
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:12, marginBottom:12 }}>
        <Panel title="Revenue Trend" subtitle="Daily performance analytics">
          <div style={{ padding:'12px 16px 14px' }}>
            <ResponsiveContainer width="100%" height={168}>
              <BarChart data={dynamicWeeklyTrend} margin={{ top:2, right:4, bottom:0, left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize:11, fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={44} />
                <Tooltip 
                  contentStyle={ttpStyle} 
                  cursor={{ fill:'var(--surface2)', opacity:0.4 }} 
                  formatter={(v, name) => [`₹${Number(v).toLocaleString('en-IN')}`, name.charAt(0).toUpperCase() + name.slice(1)]} 
                />
                <Bar dataKey="sales" name="revenue" fill="var(--admin)" radius={[4,4,0,0]} maxBarSize={32} animationDuration={1000} />
                <Bar dataKey="profit" name="profit" fill="var(--green)" radius={[4,4,0,0]} maxBarSize={32} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ marginTop: 12, display: 'flex', gap: 12, overflowX: 'auto' }} className="custom-scrollbar">
              {aiInsights.map((insight, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`${range}-${idx}`}
                  style={{ 
                    flexShrink: 0, padding: '8px 12px', borderRadius: 8, background: 'var(--surface2)', 
                    border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8,
                    maxWidth: 280
                  }}>
                  <Zap size={14} className="text-blue-400" />
                  <span style={{ fontSize: 11, color: 'var(--text2)', whiteSpace: 'normal', lineHeight: 1.4 }}>{insight}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Receivables" subtitle="Collection status">
          <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={range}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[
                  { label:'Collected',    val:collectedRecv, pct: totalRecv > 0 ? Math.round(collectedRecv/totalRecv*100) : 0, color:'var(--green)' },
                  { label:'Outstanding',  val:pendingRecv,   pct: totalRecv > 0 ? Math.round(pendingRecv/totalRecv*100) : 0,   color:'var(--amber)' },
                ].map(m => (
                  <div key={m.label} style={{ marginBottom: 12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:12, color:'var(--text2)' }}>{m.label}</span>
                      <span style={{ fontSize:12, fontWeight:600, color:'var(--text)', fontVariantNumeric:'tabular-nums' }}>
                        {fmtCur(m.val)} <span style={{ fontWeight:400, color:'var(--text3)' }}>({m.pct}%)</span>
                      </span>
                    </div>
                    <div style={{ height:5, background:'var(--surface3)', borderRadius:3, overflow:'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${m.pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ height:'100%', background:m.color, borderRadius:3 }} 
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
            <div style={{ paddingTop:10, borderTop:'1px solid var(--border)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { label:'Suppliers',    val:pay.rows.length,                                          color:'var(--text)' },
                { label:'Overdue Bills',val:filteredPay.filter(r => r.status==='Overdue').length,        color:'var(--red)'  },
                { label:'Inventory SKUs',val:inv.rows.length,                                         color:'var(--text)' },
                { label:'Fabric Orders',val:filteredFab.length,                                       color:'var(--text)' },
              ].map(k => (
                <div key={k.label} style={{ background:'var(--surface2)', borderRadius:7, padding:'9px 11px' }}>
                  <div style={{ fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{k.label}</div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, color:k.color }}>{k.val}</div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Sales table */}
      <Panel title="Recent Sales" subtitle={`${filteredSales.length} records`} action="Add Sale →" onAction={() => openAdd('sales')} style={{ marginBottom:12 }}>
        <DataTable
          columns={COLS.sales} rows={filteredSales} loading={sales.loading}
          highlightQuery={highlight}
          onAdd={() => openAdd('sales')}
          onEdit={row => openEdit('sales', row)}
          onDelete={id => sales.remove(id)}
          onExportPDF={() => exportToPDF('Sales', COLS.sales, sales.rows)}
          onExportExcel={() => exportToExcel('Sales', COLS.sales, sales.rows)}
        />
      </Panel>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:10 }}>
        {[
          { label:'Gross Margin',           val:'38.4%',  delta:'↑ 2.1pp vs last quarter', up:true  },
          { label:'Inventory Turnover',     val:'6.2×',   delta:'↑ 0.4× vs last month',    up:true  },
          { label:'Days Sales Outstanding', val:'18 days',delta:'↓ 2 days — improving',     up:true  },
          { label:'Supplier Payment Avg',   val:'34 days',delta:'Net-30 target',             up:false },
          { label:'Order Fill Rate',        val:'97.2%',  delta:'↑ 0.8pp this month',       up:true  },
          { label:'Return Rate',            val:'1.4%',   delta:'↓ 0.2pp vs last month',    up:true  },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 14px' }}>
            <div style={{ fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:19, fontWeight:700, color:'var(--text)', marginBottom:4 }}>{k.val}</div>
            <div style={{ fontSize:11.5, color:k.up ? 'var(--green)' : 'var(--amber)' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {modal && (
        <DataModal
          title={editing ? `Edit ${PAGE_LABELS[modal] || 'Record'}` : `Add ${PAGE_LABELS[modal] || 'Record'}`}
          schema={FORM_SCHEMAS[modal === 'sales' ? 'sales_entries' : modal === 'payments' ? 'supplier_payments' : modal === 'fabric' ? 'fabric_orders' : modal]}
          initial={editing}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
