import { useState, useEffect } from 'react'
import StatusBadge from './StatusBadge'
import { Pencil, Trash2, Plus, Download, ChevronLeft, ChevronRight } from 'lucide-react'

const CURRENCY_KEYS = new Set(['amount','budget','spend','revenue','cost'])
const STATUS_KEYS   = new Set(['status'])

function fmtCell(val, key) {
  if (val === null || val === undefined || val === '') return '—'
  if (CURRENCY_KEYS.has(key)) {
    const n = Number(val)
    if (isNaN(n)) return String(val)
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
    if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}k`
    return `₹${n.toLocaleString('en-IN')}`
  }
  return String(val)
}

const PAGE_SIZE = 10

export default function DataTable({ columns, rows, onAdd, onEdit, onDelete, onExportPDF, onExportExcel, loading, highlightQuery }) {
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!highlightQuery) return
    const q = highlightQuery.toLowerCase()
    const index = rows.findIndex(row => Object.values(row).some(v => String(v).toLowerCase().includes(q)))
    if (index !== -1) {
      setPage(Math.floor(index / PAGE_SIZE))
    }
  }, [highlightQuery, rows])

  const totalPages = Math.ceil(rows.length / PAGE_SIZE)
  const pageRows   = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const isHighlighted = (row) => {
    if (!highlightQuery) return false
    const q = highlightQuery.toLowerCase()
    return Object.values(row).some(v => String(v).toLowerCase().includes(q))
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8, borderRadius: 6, animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
    )
  }

  const btnBase = {
    height: 28, padding: '0 10px', borderRadius: 6,
    border: '1px solid var(--border2)', background: 'transparent',
    cursor: 'pointer', fontSize: 11.5, color: 'var(--text2)',
    display: 'flex', alignItems: 'center', gap: 4,
    fontFamily: 'inherit', transition: 'border-color 0.12s, color 0.12s',
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>
          {rows.length} record{rows.length !== 1 ? 's' : ''}
          {totalPages > 1 && ` · page ${page + 1} of ${totalPages}`}
        </span>
        <div style={{ display: 'flex', gap: 5 }}>
          {onExportExcel && (
            <button onClick={onExportExcel} style={btnBase}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}>
              <Download size={11} />Excel
            </button>
          )}
          {onExportPDF && (
            <button onClick={onExportPDF} style={btnBase}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}>
              <Download size={11} />PDF
            </button>
          )}
          {onAdd && (
            <button onClick={onAdd} style={{
              ...btnBase, background: 'var(--admin)', border: 'none',
              color: '#fff', fontWeight: 600, fontSize: 12,
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <Plus size={12} />Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface)' }}>
              {columns.map(col => (
                <th key={col.key} style={{
                  textAlign: 'left', padding: '8px 14px',
                  fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.07em', color: 'var(--text3)',
                  borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                }}>{col.label}</th>
              ))}
              {(onEdit || onDelete) && (
                <th style={{ width: 68, borderBottom: '1px solid var(--border)' }} />
              )}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text3)', fontSize: 13 }}>
                  No records yet.
                  {onAdd && (
                    <button onClick={onAdd} style={{ marginLeft: 6, color: 'var(--admin)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, textDecoration: 'underline' }}>
                      Add first entry →
                    </button>
                  )}
                </td>
              </tr>
            ) : pageRows.map((row, ri) => {
              const highlighted = isHighlighted(row)
              return (
                <tr key={row.id ?? ri}
                  style={{ 
                    borderBottom: '1px solid var(--border)',
                    background: highlighted ? 'rgba(59,130,246,0.1)' : 'transparent',
                    borderLeft: highlighted ? '3px solid var(--admin)' : 'none'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = highlighted ? 'rgba(59,130,246,0.15)' : 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = highlighted ? 'rgba(59,130,246,0.1)' : 'transparent'}
                >
                  {columns.map(col => (
                    <td key={col.key} style={{
                      padding: '9px 14px', fontSize: 12.5, color: highlighted ? '#fff' : 'var(--text2)',
                      whiteSpace: 'nowrap', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis',
                      fontWeight: highlighted ? 600 : 400
                    }}>
                      {STATUS_KEYS.has(col.key)
                        ? <StatusBadge status={row[col.key]} />
                        : fmtCell(row[col.key], col.key)}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td style={{ padding: '6px 10px' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        {onEdit && (
                          <button onClick={() => onEdit(row)} title="Edit"
                            style={{ width: 26, height: 26, borderRadius: 5, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}>
                            <Pencil size={11} />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => window.confirm('Delete this record?') && onDelete(row.id)} title="Delete"
                            style={{ width: 26, height: 26, borderRadius: 5, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, rows.length)} of {rows.length}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              style={{ ...btnBase, opacity: page === 0 ? 0.4 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer', padding: '0 8px' }}>
              <ChevronLeft size={13} />
            </button>
            {[...Array(totalPages)].map((_, pi) => (
              <button key={pi} onClick={() => setPage(pi)}
                style={{ ...btnBase, padding: '0 9px', minWidth: 28, justifyContent: 'center',
                  background: page === pi ? 'var(--admin)' : 'transparent',
                  color: page === pi ? '#fff' : 'var(--text2)',
                  border: `1px solid ${page === pi ? 'var(--admin)' : 'var(--border2)'}`,
                }}>{pi + 1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              style={{ ...btnBase, opacity: page === totalPages - 1 ? 0.4 : 1, cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer', padding: '0 8px' }}>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
