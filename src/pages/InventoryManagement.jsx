import { useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import DataModal from '../components/DataModal'
import StatCard from '../components/StatCard'
import { useTable } from '../hooks/useTable'
import { initInventory, FORM_SCHEMAS } from '../data/seedData'
import { exportToPDF, exportToExcel } from '../utils/exportUtils'
import { Package, AlertTriangle, TrendingUp, Layers } from 'lucide-react'

const COLS = [
  { key:'name',label:'Item' },{ key:'category',label:'Category' },
  { key:'units',label:'Units' },{ key:'unit',label:'Type' },
  { key:'reorder',label:'Reorder At' },{ key:'cost',label:'₹/Unit' },{ key:'status',label:'Status' },
]
const fmtCur = v => { const n=Number(v||0); return n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}k`:`₹${n}` }

export default function InventoryManagement() {
  const inv = useTable('inventory', initInventory)
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)

  const lowStock   = inv.rows.filter(r=>r.status==='Low Stock'||r.status==='Critical')
  const inStock    = inv.rows.filter(r=>r.status==='In Stock')
  const totalValue = inv.rows.reduce((s,r)=>s+Number(r.units||0)*Number(r.cost||0),0)

  const openAdd  = ()    => { setEditing(null); setModal(true) }
  const openEdit = row   => { setEditing(row);  setModal(true) }
  const close    = ()    => { setModal(false);  setEditing(null) }
  const handleSave = async form => {
    if (editing) await inv.edit(editing.id, form)
    else         await inv.add(form)
    close()
  }

  return (
    <div className="fade-up">
      <div style={{ marginBottom:18 }}>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'var(--text)' }}>Inventory</h1>
        <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>Track stock levels, costs, and reorder points</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:10, marginBottom:14 }}>
        <StatCard icon={Layers}        label="Total SKUs"      value={String(inv.rows.length)} change="all items"      up={true}  accentColor="var(--admin)" />
        <StatCard icon={AlertTriangle} label="Low / Critical"  value={String(lowStock.length)} change="need reorder"   up={false} accentColor="var(--red)"   />
        <StatCard icon={TrendingUp}    label="Inventory Value" value={fmtCur(totalValue)}      change="at cost price"  up={true}  accentColor="var(--green)" />
        <StatCard icon={Package}       label="In Stock"        value={String(inStock.length)}  change="fully stocked"  up={true}  accentColor="var(--teal)"  />
      </div>

      <Panel title="Stock Register" subtitle={`${inv.rows.length} SKUs`}>
        <DataTable
          columns={COLS} rows={inv.rows} loading={inv.loading}
          onAdd={openAdd} onEdit={openEdit} onDelete={id=>inv.remove(id)}
          onExportPDF={()=>exportToPDF('Inventory',COLS,inv.rows)}
          onExportExcel={()=>exportToExcel('Inventory',COLS,inv.rows)}
        />
      </Panel>

      {modal && (
        <DataModal
          title={editing ? 'Edit Item' : 'Add Item'}
          schema={FORM_SCHEMAS.inventory}
          initial={editing}
          onSave={handleSave}
          onClose={close}
        />
      )}
    </div>
  )
}
