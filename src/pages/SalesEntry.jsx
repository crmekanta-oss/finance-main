import { useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import DataModal from '../components/DataModal'
import StatCard from '../components/StatCard'
import { useTable } from '../hooks/useTable'
import { initSales, FORM_SCHEMAS } from '../data/seedData'
import { exportToPDF, exportToExcel } from '../utils/exportUtils'
import { Receipt, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

const COLS = [
  { key:'date',label:'Date' },{ key:'client',label:'Client' },
  { key:'product',label:'Product' },{ key:'qty',label:'Qty' },
  { key:'amount',label:'Amount' },{ key:'status',label:'Status' },
]
const fmtCur = v => { const n=Number(v||0); return n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}k`:`₹${n}` }

export default function SalesEntry() {
  const sales = useTable('sales_entries', initSales)
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)

  const totRev  = sales.rows.reduce((s,r)=>s+Number(r.amount||0),0)
  const completed = sales.rows.filter(r=>r.status==='Completed'||r.status==='Paid')
  const pending   = sales.rows.filter(r=>r.status==='Pending')
  const overdue   = sales.rows.filter(r=>r.status==='Overdue')

  const openAdd  = ()    => { setEditing(null); setModal(true) }
  const openEdit = row   => { setEditing(row);  setModal(true) }
  const close    = ()    => { setModal(false);  setEditing(null) }
  const handleSave = async form => {
    if (editing) await sales.edit(editing.id, form)
    else         await sales.add(form)
    close()
  }

  return (
    <div className="fade-up">
      <div style={{ marginBottom:18 }}>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'var(--text)' }}>Sales Entry</h1>
        <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>Record and manage all sales transactions</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:10, marginBottom:14 }}>
        <StatCard icon={DollarSign}   label="Total Revenue"  value={fmtCur(totRev)}              change="all records"       up={true}  accentColor="var(--admin)" />
        <StatCard icon={Receipt}      label="Total Orders"   value={String(sales.rows.length)}   change="all time"          up={true}  accentColor="var(--green)" />
        <StatCard icon={CheckCircle}  label="Completed"      value={String(completed.length)}    change="paid & fulfilled"  up={true}  accentColor="var(--green)" />
        <StatCard icon={AlertTriangle} label="Overdue"       value={String(overdue.length)}      change="action needed"     up={false} accentColor="var(--red)"   />
      </div>

      <Panel title="Sales Ledger" subtitle={`${sales.rows.length} entries`}>
        <DataTable
          columns={COLS} rows={sales.rows} loading={sales.loading}
          onAdd={openAdd} onEdit={openEdit} onDelete={id=>sales.remove(id)}
          onExportPDF={()=>exportToPDF('Sales',COLS,sales.rows)}
          onExportExcel={()=>exportToExcel('Sales',COLS,sales.rows)}
        />
      </Panel>

      {modal && (
        <DataModal
          title={editing ? 'Edit Sale' : 'New Sale'}
          schema={FORM_SCHEMAS.sales_entries}
          initial={editing}
          onSave={handleSave}
          onClose={close}
        />
      )}
    </div>
  )
}
