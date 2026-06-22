const MAP = {
  // Green
  Paid:           '#22c55e', Received:    '#22c55e', Active:    '#22c55e',
  Delivered:      '#22c55e', Completed:   '#22c55e', 'In Stock':'#22c55e',
  Sent:           '#22c55e', Online:      '#22c55e',
  // Blue
  'In Transit':   '#3b82f6', Ordered:     '#3b82f6', Confirmed: '#3b82f6',
  'Due Soon':     '#3b82f6', Upcoming:    '#3b82f6',
  // Amber
  Pending:        '#f59e0b', 'Low Stock': '#f59e0b', Paused:    '#f59e0b',
  'Low Budget':   '#f59e0b', Away:        '#f59e0b', 'Reorder Soon':'#f59e0b',
  // Red
  Overdue:        '#ef4444', Critical:    '#ef4444', Cancelled: '#ef4444',
  'Out of Stock': '#ef4444',
  // Gray
  Ended:          '#6b7280', Offline:     '#6b7280',
  // Purple
  Premium:        '#a855f7',
  // Teal
  Export:         '#14b8a6',
  // Segment badges
  Wholesale:      '#3b82f6', Retail:      '#f59e0b',
}

export default function StatusBadge({ status }) {
  if (!status) return null
  const c = MAP[status] || '#6b7280'
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'2px 8px', borderRadius:5,
      fontSize:11, fontWeight:600, letterSpacing:'0.01em',
      background:`${c}18`, color:c, whiteSpace:'nowrap',
    }}>
      <span style={{ width:4, height:4, borderRadius:'50%', background:c, flexShrink:0 }} />
      {status}
    </span>
  )
}
