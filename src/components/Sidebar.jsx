import {
  LayoutDashboard, Receipt, Package, CreditCard, Banknote, Layers,
  BarChart2, Search, Share2, MessageSquare, TrendingUp,
  Landmark, Users, CheckSquare, FileText, ChevronRight,
} from 'lucide-react'

const NAV = {
  admin: [
    { section: 'Overview' },
    { key: 'dashboard',   label: 'Dashboard',      Icon: LayoutDashboard },
    { section: 'Operations' },
    { key: 'sales',       label: 'Sales Entry',    Icon: Receipt        },
    { key: 'inventory',   label: 'Inventory',      Icon: Package        },
    { key: 'payments',    label: 'Payments',       Icon: CreditCard     },
    { key: 'receivables', label: 'Receivables',    Icon: Banknote       },
    { key: 'fabric',      label: 'Fabric Orders',  Icon: Layers         },
    { section: 'Reports' },
    { key: 'reports',     label: 'Reports',        Icon: FileText       },
  ],
  marketing: [
    { section: 'Overview' },
    { key: 'dashboard',  label: 'Dashboard',       Icon: LayoutDashboard },
    { section: 'Ad Channels' },
    { key: 'google',     label: 'Google Ads',      Icon: Search          },
    { key: 'meta',       label: 'Meta Ads',        Icon: Share2          },
    { key: 'comm',       label: 'Comms Ads',       Icon: MessageSquare   },
    { section: 'Analytics' },
    { key: 'roi',        label: 'ROI Analytics',   Icon: TrendingUp      },
    { section: 'Reports' },
    { key: 'reports',    label: 'Reports',         Icon: FileText        },
  ],
  ceo: [
    { section: 'Overview' },
    { key: 'dashboard',   label: 'Dashboard',      Icon: LayoutDashboard },
    { section: 'Operations' },
    { key: 'sales',       label: 'Sales Entry',    Icon: Receipt         },
    { key: 'inventory',   label: 'Inventory',      Icon: Package         },
    { key: 'payments',    label: 'Payments',       Icon: CreditCard      },
    { key: 'receivables', label: 'Receivables',    Icon: Banknote        },
    { key: 'fabric',      label: 'Fabric Orders',  Icon: Layers          },
    { section: 'Marketing' },
    { key: 'google',      label: 'Google Ads',     Icon: Search          },
    { key: 'meta',        label: 'Meta Ads',       Icon: Share2          },
    { key: 'comm',        label: 'Comms Ads',      Icon: MessageSquare   },
    { key: 'roi',         label: 'ROI Analytics',  Icon: TrendingUp      },
    { section: 'Command' },
    { key: 'investments', label: 'Investments',    Icon: Landmark        },
    { key: 'team',        label: 'Team',           Icon: Users           },
    { key: 'decisions',   label: 'Decisions',      Icon: CheckSquare     },
    { section: 'Reports' },
    { key: 'reports',     label: 'Reports',        Icon: FileText        },
  ],
}

const ROLE_COLOR = {
  admin:     'var(--admin)',
  marketing: 'var(--mkt)',
  ceo:       'var(--ceo)',
}

export default function Sidebar({ role, activeModule, setModule }) {
  const norm  = (role || 'admin').toLowerCase()
  const nav   = NAV[norm] || NAV.admin
  const color = ROLE_COLOR[norm] || ROLE_COLOR.admin

  return (
    <aside style={{
      width: 212, minWidth: 212,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', flexShrink: 0,
    }}>
      <div style={{ flex: 1, paddingTop: 8, paddingBottom: 8 }}>
        {nav.map((item, i) => {
          if (item.section) {
            return (
              <div key={`s-${i}`} style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--text3)',
                padding: '12px 16px 4px',
              }}>{item.section}</div>
            )
          }
          const active = activeModule === item.key
          const { Icon } = item
          return (
            <button key={item.key} onClick={() => setModule(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '7px 14px',
                border: 'none', outline: 'none',
                borderLeft: `2px solid ${active ? color : 'transparent'}`,
                background: active
                  ? (norm === 'admin'     ? 'rgba(59,130,246,0.08)'
                    : norm === 'marketing' ? 'rgba(249,115,22,0.08)'
                    :                       'rgba(168,85,247,0.08)')
                  : 'transparent',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 12.5,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--text)' : 'var(--text2)',
                fontFamily: 'Inter, sans-serif',
                transition: 'background 0.12s, color 0.12s, border-color 0.12s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--surface2)'
                  e.currentTarget.style.color = 'var(--text)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text2)'
                }
              }}
            >
              <Icon size={14} style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {active && <ChevronRight size={11} style={{ opacity: 0.4, flexShrink: 0 }} />}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 14px 14px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <div className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>All systems operational</span>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--text3)', paddingLeft: 12 }}>
          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
    </aside>
  )
}
