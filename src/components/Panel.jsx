export default function Panel({ title, subtitle, tag, tagColor, tagBg, action, onAction, children, style }) {
  const hasHeader = title || tag || action
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 10, overflow: 'hidden', ...style,
    }}>
      {hasHeader && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{
              fontFamily: 'Syne, sans-serif', fontSize: 13.5, fontWeight: 700,
              color: 'var(--text)', whiteSpace: 'nowrap',
            }}>{title}</span>
            {tag && (
              <span style={{
                fontSize: 10.5, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                background: tagBg || 'rgba(59,130,246,0.12)', color: tagColor || '#60a5fa',
                whiteSpace: 'nowrap',
              }}>{tag}</span>
            )}
            {subtitle && (
              <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 4 }}>{subtitle}</span>
            )}
          </div>
          {action && (
            <button onClick={onAction} style={{
              fontSize: 11.5, color: 'var(--admin)', cursor: 'pointer',
              background: 'none', border: 'none', fontFamily: 'inherit',
              whiteSpace: 'nowrap', marginLeft: 12, flexShrink: 0,
            }}>{action}</button>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
