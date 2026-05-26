import { Wifi, X } from 'lucide-react'
import { useState } from 'react'

export default function LiveBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.16)',
      borderRadius:8, padding:'8px 12px', fontSize:12.5, marginBottom:16, color:'var(--text2)',
      position:'relative',
    }}>
      <div className="pulse" style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', flexShrink:0 }} />
      <Wifi size={13} style={{ color:'var(--green)', flexShrink:0 }} />
      <span style={{ flex:1 }}>
        <strong style={{ color:'var(--text)' }}>Ekanta</strong> — Real-time sync active · All modules connected · Data updates every 30 seconds
      </span>
      <button onClick={() => setDismissed(true)}
        style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex', padding:2, flexShrink:0 }}>
        <X size={13} />
      </button>
    </div>
  )
}
