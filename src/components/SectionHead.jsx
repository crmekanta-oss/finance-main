export default function SectionHead({ label, color, sub }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', margin:'24px 0 14px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
      <div>
        <div style={{ fontFamily:'Syne, sans-serif', fontSize:15, fontWeight:700, color:color||'var(--text)' }}>{label}</div>
        {sub && <div style={{ fontSize:11.5, color:'var(--text2)', marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  )
}
