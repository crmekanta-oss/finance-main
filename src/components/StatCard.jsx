import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, change, up, accentColor, sub }) {
  return (
    <div className="fade-up" style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '14px 16px', position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}>
      {/* top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accentColor || 'var(--admin)' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text2)' }}>
          {label}
        </div>
        {Icon && (
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: (accentColor || 'var(--admin)') + '1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={13} style={{ color: accentColor || 'var(--admin)' }} />
          </div>
        )}
      </div>

      <div style={{
        fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700,
        color: 'var(--text)', letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginBottom: sub ? 3 : 0,
      }}>{value}</div>

      {sub && <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>{sub}</div>}

      {change !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, marginTop: 6,
          fontSize: 11.5, color: up ? 'var(--green)' : 'var(--red)',
        }}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}
