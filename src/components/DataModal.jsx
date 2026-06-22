import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Search, ChevronDown } from 'lucide-react'

export default function DataModal({ title, schema, initial, onSave, onClose }) {
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(initial ? { ...initial } : {})
  }, [initial])

  // Disable body scroll when modal opens
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  const setField = useCallback((key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
  }, [])

  const inputStyle = focused => ({
    width: '100%', padding: '9px 11px',
    borderRadius: 7, border: `1px solid ${focused ? 'var(--admin)' : 'var(--border2)'}`,
    background: 'var(--surface2)', color: 'var(--text)',
    fontSize: 13, fontFamily: 'inherit', outline: 'none',
    boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  })

  const modalContent = (
    <>
      <style>{`
        .dropdown-animate {
          animation: dropdownOpen 0.2s ease-out;
          transform-origin: top;
        }
        @keyframes dropdownOpen {
          from { opacity: 0; transform: scaleY(0.95); }
          to { opacity: 1; transform: scaleY(1); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--border3); }
      `}</style>
      {/* ── Overlay: Fullscreen fixed background ──────────────── */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, 
          background: 'rgba(0,0,0,0.65)', 
          backdropFilter: 'blur(4px)', 
          zIndex: 9999,
          cursor: 'default'
        }} 
      />

      {/* ── Wrapper: Handles centering and independent scroll ────── */}
      <div 
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
        style={{
          position: 'fixed', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px 14px',
          zIndex: 10000,
          overflowY: 'auto', 
          pointerEvents: 'none' 
        }}>
        
        {/* ── Modal: The actual content box ─────────────────────── */}
        <div style={{
          position: 'relative',
          background: 'var(--surface)', 
          border: '1px solid var(--border2)',
          borderRadius: 14, 
          width: '100%', 
          maxWidth: 520,
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '0 32px 100px rgba(0,0,0,0.6)',
          pointerEvents: 'auto' 
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'inherit', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0,
            }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                {title}
              </span>
              <button type="button" onClick={onClose}
                style={{ 
                  width: 30, height: 30, borderRadius: 8, 
                  border: '1px solid var(--border)', background: 'transparent', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: 'var(--text2)', transition: 'all 0.15s' 
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(schema || []).map(f => (
                <FieldRow key={f.key} field={f} value={form[f.key] ?? ''} onChange={val => setField(f.key, val)} inputStyle={inputStyle} />
              ))}
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', gap: 10, justifyContent: 'flex-end',
              padding: '16px 20px', borderTop: '1px solid var(--border)',
              background: 'var(--surface)', flexShrink: 0, borderRadius: '0 0 14px 14px'
            }}>
              <button type="button" onClick={onClose}
                style={{ 
                  height: 36, padding: '0 20px', borderRadius: 8, 
                  border: '1px solid var(--border2)', background: 'transparent', 
                  cursor: 'pointer', fontSize: 13, color: 'var(--text2)', 
                  fontFamily: 'inherit', transition: 'all 0.15s' 
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving}
                style={{ 
                  height: 36, padding: '0 24px', borderRadius: 8, 
                  border: 'none', background: 'var(--admin)', 
                  cursor: saving ? 'not-allowed' : 'pointer', 
                  fontSize: 13, fontWeight: 600, color: '#fff', 
                  fontFamily: 'inherit', opacity: saving ? 0.7 : 1, 
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
                }}>
                {saving ? (
                  <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />Saving…</>
                ) : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.getElementById('modal-root'))
}

function FieldRow({ field: f, value, onChange, inputStyle }) {
  const [focused, setFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = (f.options || []).filter(o => 
    o.toLowerCase().includes(search.toLowerCase())
  )

  if (f.type === 'search-select') {
    return (
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>
          {f.label}
        </label>

        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            ...inputStyle(focused || isOpen),
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <span style={{ color: value ? 'var(--text)' : 'var(--text3)' }}>
            {value || `Select ${f.label}...`}
          </span>
          <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>

        {isOpen && (
          <div className="dropdown-animate" style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--surface)', border: '1px solid var(--border2)',
            borderRadius: 8, marginTop: 4, zIndex: 100,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                <input 
                  autoFocus
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    ...inputStyle(true),
                    paddingLeft: 32,
                    height: 32
                  }}
                />
              </div>
            </div>
            <div className="custom-scrollbar" style={{ maxHeight: 200, overflowY: 'auto' }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(o => (
                  <div 
                    key={o}
                    onClick={() => {
                      onChange(o)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    style={{
                      padding: '8px 12px', fontSize: 13, cursor: 'pointer',
                      color: value === o ? 'var(--admin)' : 'var(--text2)',
                      background: value === o ? 'rgba(59,130,246,0.08)' : 'transparent',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => {
                      if (value !== o) e.currentTarget.style.background = 'var(--surface2)'
                      e.currentTarget.style.color = 'var(--text)'
                    }}
                    onMouseLeave={e => {
                      if (value !== o) e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = value === o ? 'var(--admin)' : 'var(--text2)'
                    }}
                  >
                    {o}
                  </div>
                ))
              ) : (
                <div style={{ padding: '12px', textAlign: 'center', fontSize: 12, color: 'var(--text3)' }}>No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', display: 'block', marginBottom: 5 }}>
        {f.label}
      </label>
      {f.type === 'select' ? (
        <select value={value} onChange={e => onChange(e.target.value)}
          style={inputStyle(focused)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <option value="">Select…</option>
          {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={f.type || 'text'} value={value} placeholder={f.placeholder || ''}
          onChange={e => onChange(e.target.value)}
          style={inputStyle(focused)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      )}
    </div>
  )
}
