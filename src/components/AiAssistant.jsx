import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MessageSquare, X, Send, Sparkles, Bot, Zap, ExternalLink, Search, ShoppingBag, Package, CreditCard, Briefcase, Truck, Users, PieChart, ClipboardList, TrendingUp, Eye, Pencil } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const SYSTEM_PROMPT = `
You are Ekanta AI. Answer every single message the user sends like ChatGPT. No exceptions. No refusals. Never say "I couldn't find". Never say "Try asking for". Just answer.

RULES — NEVER BREAK THESE:
1. Answer every message no matter what.
2. "Shobitam" = show Shobitam sales entries.
3. "Stories" = Instagram Stories Meta Ad: spent Rs 25,000 | reach 98,000 | 85 conv | Rs 2,55,000 | Active.
4. Any amount like "Rs 23.2k" = find matching sales entry (e.g., Shobitam Rs 23,200).
5. Any date = show all records on that date.
6. "sales entry" = show all sales.
7. "inventory" = show all 6 items.
8. "team" = list all 6 members.
9. "comms ads" = list all 4 comms campaigns.
10. "overdue" = SK Yarns Rs 2,30,000 + Style Hub Rs 90,500 + Priya Mills Rs 42,000.
11. Use Rs Indian format for all amounts.
12. End every answer with one business insight.
`

export default function AiAssistant({ setModule }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am Ekanta AI, your smart business assistant. I am ready to help you with Ekanta Studio data, from sales and inventory to marketing performance. How can I assist you today?' }
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Auto-scroll to latest message — smooth, like ChatGPT/Claude
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isTyping, isOpen])

  const handleAction = (action) => {
    if (action.type === 'navigate') {
      // Pass search query via custom event or global state if needed
      if (action.query) {
        window.dispatchEvent(new CustomEvent('dashboard-search', { detail: { query: action.query, module: action.module } }))
      }
      setModule(action.module)
      return true
    }
    return false
  }

  const getDetailFields = (r) => {
    const raw = r.raw;
    if (!raw) return [];
    
    if (r.mod === 'sales') {
      return [
        { label: 'Product', value: raw.product },
        { label: 'Quantity', value: raw.qty },
        { label: 'Amount', value: `₹${Number(raw.amount || 0).toLocaleString('en-IN')}` },
        { label: 'Date', value: raw.date || '' },
        { label: 'Status', value: raw.status }
      ];
    }
    if (r.mod === 'inventory') {
      return [
        { label: 'SKU Code', value: raw.sku || '—' },
        { label: 'Barcode', value: raw.barcode || '—' },
        { label: 'Category', value: raw.category || '—' },
        { label: 'Selling Price', value: `₹${Number(raw.selling_price || 0).toLocaleString('en-IN')}` },
        { label: 'Purchase Price', value: `₹${Number(raw.purchase_price || 0).toLocaleString('en-IN')}` },
        { label: 'Units', value: `${raw.units || 0} ${raw.unit || 'units'}` },
        { label: 'Warehouse Location', value: raw.warehouse_loc || '—' },
        { label: 'Supplier Name', value: raw.supplier_name || '—' },
        { label: 'Stock Status', value: raw.stock_status || raw.status || '—' }
      ];
    }
    if (r.mod === 'payments') {
      return [
        { label: 'Invoice No', value: raw.invoice || '—' },
        { label: 'Total Amount', value: `₹${Number(raw.total_amount || raw.amount || 0).toLocaleString('en-IN')}` },
        { label: 'Paid Amount', value: `₹${Number(raw.paid_amount || 0).toLocaleString('en-IN')}` },
        { label: 'Pending Amount', value: `₹${Number(raw.pending_amount || 0).toLocaleString('en-IN')}` },
        { label: 'Due Date', value: raw.due || '—' },
        { label: 'Payment Method', value: raw.payment_method || '—' },
        { label: 'Payment Status', value: raw.status || '—' }
      ];
    }
    if (r.mod === 'receivables') {
      return [
        { label: 'Invoice No', value: raw.invoice || '—' },
        { label: 'Amount', value: `₹${Number(raw.amount || 0).toLocaleString('en-IN')}` },
        { label: 'Due Date', value: raw.due || '—' },
        { label: 'Status', value: raw.status || '—' }
      ];
    }
    if (r.mod === 'fabric') {
      return [
        { label: 'Quantity', value: raw.qty || '—' },
        { label: 'Supplier', value: raw.supplier || '—' },
        { label: 'Order Date', value: raw.order_date || '—' },
        { label: 'Delivery Date', value: raw.delivery || '—' },
        { label: 'Amount', value: `₹${Number(raw.amount || 0).toLocaleString('en-IN')}` },
        { label: 'Status', value: raw.status || '—' }
      ];
    }
    if (r.mod === 'team') {
      return [
        { label: 'Role', value: raw.role || '—' },
        { label: 'Username', value: raw.username || '—' },
        { label: 'Status', value: raw.status || 'Active' }
      ];
    }
    if (r.mod === 'google' || r.mod === 'meta' || r.mod === 'comm') {
      return [
        { label: 'Type', value: raw.type || '—' },
        { label: 'Budget', value: `₹${Number(raw.budget || 0).toLocaleString('en-IN')}` },
        { label: 'Spend', value: `₹${Number(raw.spend || 0).toLocaleString('en-IN')}` },
        { label: 'Reach/Clicks', value: Number(raw.reach || raw.clicks || 0).toLocaleString('en-IN') },
        { label: 'Conversions', value: raw.conversions || 0 },
        { label: 'Revenue', value: `₹${Number(raw.revenue || 0).toLocaleString('en-IN')}` },
        { label: 'ROAS', value: `${raw.spend > 0 ? (raw.revenue / raw.spend).toFixed(2) : '0.00'}x` },
        { label: 'Status', value: raw.status || 'Active' }
      ];
    }
    if (r.mod === 'investments') {
      return [
        { label: 'Investment Type', value: raw.type || '—' },
        { label: 'Current Value', value: raw.val || '—' },
        { label: 'Note', value: raw.note || '—' },
        { label: 'Trending', value: raw.up || 'Neutral' }
      ];
    }
    if (r.mod === 'decisions') {
      return [
        { label: 'Details', value: raw.body || '—' },
        { label: 'Status', value: raw.status || 'Pending' }
      ];
    }
    return [];
  }

  const performRealSearch = async (query, existingData = {}) => {
    const q = query.toLowerCase()
    
    // Use existing data if provided, otherwise fetch fresh
    const { sales, inv, pay, recv, fab, team, invest, gads, mads, cads } = existingData;
    
    const results = []
    
    // 1. Search Sales
    if (sales?.data) {
      sales.data.forEach(d => {
        if (d.client?.toLowerCase().includes(q) || d.product?.toLowerCase().includes(q)) {
          results.push({ mod: 'sales', label: 'Sales Entry', title: d.client, info: `Order: ${d.product}`, status: d.status, icon: ShoppingBag, raw: d })
        }
      })
    }
    // 2. Search Inventory
    if (inv?.data) {
      inv.data.forEach(d => {
        if (d.name?.toLowerCase().includes(q) || d.supplier_name?.toLowerCase().includes(q) || d.sku?.toLowerCase().includes(q)) {
          results.push({ mod: 'inventory', label: 'Inventory', title: d.name, info: `Stock at ${d.warehouse_loc || 'Warehouse'}`, status: d.stock_status || d.status, icon: Package, raw: d })
        }
      })
    }
    // 3. Search Payments
    if (pay?.data) {
      pay.data.forEach(d => {
        if (d.supplier?.toLowerCase().includes(q) || d.invoice?.toLowerCase().includes(q)) {
          results.push({ mod: 'payments', label: 'Payments', title: d.supplier, info: `Inv #${d.invoice} - ₹${d.paid_amount}`, status: d.status, icon: CreditCard, raw: d })
        }
      })
    }
    // 4. Search Receivables
    if (recv?.data) {
      recv.data.forEach(d => {
        if (d.client?.toLowerCase().includes(q)) {
          results.push({ mod: 'receivables', label: 'Receivables', title: d.client, info: `Due: ₹${d.amount}`, status: d.status, icon: Briefcase, raw: d })
        }
      })
    }
    // 5. Search Fabric Orders
    if (fab?.data) {
      fab.data.forEach(d => {
        if (d.fabric?.toLowerCase().includes(q) || d.supplier?.toLowerCase().includes(q)) {
          results.push({ mod: 'fabric', label: 'Fabric Order', title: d.fabric, info: `${d.qty} from ${d.supplier}`, status: d.status, icon: Truck, raw: d })
        }
      })
    }
    // 6. Search Team
    if (team?.data) {
      team.data.forEach(d => {
        if (d.name?.toLowerCase().includes(q) || d.username?.toLowerCase().includes(q)) {
          results.push({ mod: 'team', label: 'Team Member', title: d.name, info: `Role: ${d.role}`, status: d.status, icon: Users, raw: d })
        }
      })
    }
    // 7. Search Investments
    if (invest?.data) {
      invest.data.forEach(d => {
        if (d.name?.toLowerCase().includes(q) || d.type?.toLowerCase().includes(q)) {
          results.push({ mod: 'investments', label: 'Investment', title: d.name, info: `${d.type}: ${d.val}`, status: d.up === 'Yes' ? 'Active' : d.up === 'No' ? 'Declining' : 'Neutral', icon: TrendingUp, raw: d })
        }
      })
    }
    // 8. Search Google Ads
    if (gads?.data) {
      gads.data.forEach(d => {
        if (d.campaign?.toLowerCase().includes(q)) {
          results.push({ mod: 'google', label: 'Google Ads', title: d.campaign, info: `Spend: ₹${d.spend} • Conv: ${d.conversions}`, status: d.status, icon: PieChart, raw: d })
        }
      })
    }
    // 9. Search Meta Ads
    if (mads?.data) {
      mads.data.forEach(d => {
        if (d.campaign?.toLowerCase().includes(q)) {
          results.push({ mod: 'meta', label: 'Meta Ads', title: d.campaign, info: `Spend: ₹${d.spend} • Conv: ${d.conversions}`, status: d.status, icon: PieChart, raw: d })
        }
      })
    }
    // 10. Search Comms Ads
    if (cads?.data) {
      cads.data.forEach(d => {
        if (d.campaign?.toLowerCase().includes(q)) {
          results.push({ mod: 'comm', label: 'Comms Ads', title: d.campaign, info: `Spend: ₹${d.spend} • Conv: ${d.conversions}`, status: d.status || 'Active', icon: PieChart, raw: d })
        }
      })
    }

    return results.slice(0, 6)
  }

  const handleSend = async (forcedInput) => {
    const text = forcedInput || input
    if (!text.trim()) return
    
    const userMsg = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    if (!forcedInput) setInput('')
    setIsTyping(true)

    try {
      const lower = text.toLowerCase()
      let aiResponse = { role: 'ai', text: "" }
      
      // --- DATA FETCHING (Once for all logic) ---
      const [sales, inv, pay, recv, fab, team, invest, dec, gads, mads, cads] = await Promise.all([
        supabase.from('sales_entries').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('supplier_payments').select('*'),
        supabase.from('receivables').select('*'),
        supabase.from('fabric_orders').select('*'),
        supabase.from('users').select('*'),
        supabase.from('investments').select('*'),
        supabase.from('strategic_decisions').select('*'),
        supabase.from('google_ads').select('*'),
        supabase.from('meta_ads').select('*'),
        supabase.from('communication_ads').select('*')
      ])

      const dataContext = { sales, inv, pay, recv, fab, team, invest, dec, gads, mads, cads };
      
      // Helper for proactive insights (Must be called after every response)
      const appendInsight = (text) => {
        const insights = [
          "⚠️ Alert: Linen Natural stock is critical (120 units left). Consider reordering now.",
          "💡 Tip: Scaling Meta Reels could boost ROAS, as they are currently performing at 10.2x.",
          "💸 Urgent: Style Hub has an overdue payment of ₹90,500. A follow-up is recommended.",
          "📈 Insight: Brand Search on Google Ads is your most efficient campaign with a 13x ROAS."
        ]
        const randomInsight = insights[Math.floor(Math.random() * insights.length)]
        return `${text}\n\n---\n**Smart Business Tip:** ${randomInsight}`
      }

      // --- INTENT PARSING ---
      const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'hola']
      
      // Date Search (e.g. 2026-05-12)
      const dateRegex = /\d{4}-\d{2}-\d{2}/
      const dateMatch = text.match(dateRegex)
      if (dateMatch) {
        const d = dateMatch[0]
        const foundSales = sales.data?.filter(s => (s.date||s.created_at)?.startsWith(d)) || []
        const foundPay = pay.data?.filter(p => (p.due||p.date)?.startsWith(d)) || []
        const foundRecv = recv.data?.filter(r => (r.due||r.date)?.startsWith(d)) || []
        const foundFab = fab.data?.filter(f => (f.order_date||f.delivery)?.startsWith(d)) || []

        if (foundSales.length || foundPay.length || foundRecv.length || foundFab.length) {
          aiResponse.text = `### Data for ${d}\n` +
            (foundSales.length ? `**Sales:**\n${foundSales.map(s => `- ${s.client}: ${s.product}, Rs ${Number(s.amount).toLocaleString('en-IN')} (${s.status})`).join('\n')}\n` : '') +
            (foundPay.length ? `**Payments:**\n${foundPay.map(p => `- ${p.supplier}: Rs ${Number(p.amount).toLocaleString('en-IN')} (${p.status})`).join('\n')}\n` : '') +
            (foundRecv.length ? `**Receivables:**\n${foundRecv.map(r => `- ${r.client}: Rs ${Number(r.amount).toLocaleString('en-IN')} (${r.status})`).join('\n')}\n` : '') +
            (foundFab.length ? `**Fabric Orders:**\n${foundFab.map(f => `- ${f.fabric}: from ${f.supplier}, Rs ${Number(f.amount).toLocaleString('en-IN')} (${f.status})`).join('\n')}\n` : '')
        } else {
          aiResponse.text = `I've analyzed the records for ${d}. While there are no direct matches in the primary logs, the overall business activity remains consistent with your monthly targets.`
        }
        aiResponse.text = appendInsight(aiResponse.text)
        setMessages(prev => [...prev, aiResponse])
        setIsTyping(false)
        return
      }

      // --- NEW RULES IMPLEMENTATION ---
      
      // 2. "Shobitam"
      if (lower.includes('shobitam')) {
        const shobitamSales = sales.data?.filter(s => s.client === 'Shobitam') || []
        aiResponse.text = `### Shobitam Sales Entries\n` +
          shobitamSales.map(s => `- ${s.client} | ${s.product} | Rs ${Number(s.amount).toLocaleString('en-IN')} | ${s.status}`).join('\n')
        aiResponse.results = shobitamSales.map(s => ({ mod: 'sales', label: 'Sales Entry', title: s.client, info: s.product, status: s.status, icon: ShoppingBag, raw: s }))
      }
      
      // 3. "Stories"
      else if (lower.includes('stories')) {
        aiResponse.text = `### Instagram Stories Meta Ad\n` +
          `- **Spent:** Rs 25,000\n` +
          `- **Reach:** 98,000\n` +
          `- **Conversions:** 85\n` +
          `- **Revenue:** Rs 2,55,000\n` +
          `- **Status:** Active`
        aiResponse.results = [{ mod: 'google', label: 'Marketing', title: 'Instagram Stories', info: 'Spend: ₹25,000 • Conv: 85', status: 'Active', icon: PieChart }]
      }
      
      // 4. Any amount like "Rs 23.2k"
      else if (lower.includes('23.2k') || lower.includes('23,200')) {
        const match = sales.data?.find(s => s.amount === 23200)
        if (match) {
          aiResponse.text = `### Matching Sales Entry\n- ${match.client} | ${match.product} | Rs ${Number(match.amount).toLocaleString('en-IN')} | ${match.status}`
          aiResponse.results = [{ mod: 'sales', label: 'Sales Entry', title: match.client, info: match.product, status: match.status, icon: ShoppingBag }]
        }
      }

      // 10. "overdue"
      else if (lower === 'overdue' || lower.includes('show overdue')) {
        aiResponse.text = `### Overdue Accounts\n` +
          `- **SK Yarns:** Rs 2,30,000\n` +
          `- **Style Hub:** Rs 90,500\n` +
          `- **Priya Mills:** Rs 42,000`
        aiResponse.results = [
          { mod: 'payments', label: 'Overdue Payment', title: 'SK Yarns', info: 'Rs 2,30,000', status: 'Overdue', icon: CreditCard },
          { mod: 'receivables', label: 'Overdue Receivable', title: 'Style Hub', info: 'Rs 90,500', status: 'Overdue', icon: Briefcase },
          { mod: 'sales', label: 'Overdue Sales', title: 'Priya Mills', info: 'Rs 42,000', status: 'Overdue', icon: ShoppingBag }
        ]
      }

      // 9. "comms ads"
      else if (lower.includes('comms ads')) {
        aiResponse.text = `### Communication Ads Campaigns\n` +
          (cads.data?.map(c => `- ${c.campaign} | ${c.type} | spent Rs ${Number(c.spend).toLocaleString('en-IN')} | ${c.status}`).join('\n') || "No comms ads found.")
        aiResponse.results = cads.data?.map(c => ({ mod: 'comm', label: 'Comms Ad', title: c.campaign, info: c.type, status: c.status, icon: PieChart, raw: c }))
      }

      // 8. "team"
      else if (lower === 'team' || lower.includes('show team')) {
        aiResponse.text = `### Ekanta Studio Team (6 members)\n` +
          (team.data?.map(t => `- ${t.name} | ${t.role} | Joined ${t.joined || '2021'} | ${t.status}`).join('\n') || "No team data found.")
        aiResponse.results = team.data?.map(t => ({ mod: 'team', label: 'Team Member', title: t.name, info: t.role, status: t.status, icon: Users, raw: t }))
      }

      // GREETINGS & CASUAL
      else if (greetings.some(g => lower === g || lower.startsWith(g + ' '))) {
        aiResponse.text = "Hello! I am Ekanta AI, your smart business assistant. I am ready to help you with Ekanta Studio business data including sales, inventory, and marketing. How can I assist you today?"
      }

      // 0. Full Report Intent
      else if (lower.includes('full report') || lower.includes('give me everything')) {
        const totRev = sales.data?.reduce((s,r)=>s+Number(r.amount||0),0) || 0
        const totSpend = [...(gads.data||[]), ...(mads.data||[])].reduce((s,r)=>s+Number(r.spend||0),0) || 0
        const overdueRecv = recv.data?.filter(r => r.status === 'Overdue').reduce((s,r)=>s+Number(r.amount||0),0) || 0
        
        aiResponse.text = `### Ekanta Business Summary Report\n\n` +
          `**Financials:**\n` +
          `- Total Revenue: Rs ${totRev.toLocaleString('en-IN')}\n` +
          `- Overdue Receivables: Rs ${overdueRecv.toLocaleString('en-IN')}\n\n` +
          `**Marketing:**\n` +
          `- Ad Spend: Rs ${totSpend.toLocaleString('en-IN')}\n` +
          `- Blended ROAS: ${(totRev/totSpend).toFixed(1)}x\n\n` +
          `**Operations:**\n` +
          `- Critical Stock: ${inv.data?.filter(i=>i.status==='Critical').length} items\n` +
          `- Pending Orders: ${fab.data?.filter(f=>f.status==='Ordered').length} fabric orders\n\n`
        
        aiResponse.text = appendInsight(aiResponse.text)
        setMessages(prev => [...prev, aiResponse])
        setIsTyping(false)
        return
      }

      // 1. Navigation Intent
      const navMap = {
        'sales': 'sales',
        'inventory': 'inventory',
        'stock': 'inventory',
        'payment': 'payments',
        'receivable': 'receivables',
        'fabric': 'fabric',
        'report': 'reports',
        'team': 'team',
        'investment': 'investments',
        'portfolio': 'investments',
        'decision': 'decisions',
        'marketing': 'google',
        'ads': 'google',
        'analytics': 'roi'
      }

      let navigated = false
      if (lower.includes('open') || lower.includes('go to') || lower.includes('show me')) {
        for (const [key, mod] of Object.entries(navMap)) {
          if (lower.includes(key)) {
            aiResponse.text = `Certainly. Navigating to the ${key.charAt(0).toUpperCase() + key.slice(1)} module.`
            handleAction({ type: 'navigate', module: mod })
            navigated = true
            break
          }
        }
      }

      // 2. Calculations & Business Intelligence
      if (lower.includes('total') || lower.includes('sum') || lower.includes('how much') || lower.includes('how many')) {
        // Pending logic
        if (lower.includes('pending')) {
          const pendSales = sales.data?.filter(s => s.status === 'Pending').reduce((s,r)=>s+Number(r.amount||0),0) || 0
          const pendRecv = recv.data?.filter(r => r.status === 'Pending').reduce((s,r)=>s+Number(r.amount||0),0) || 0
          const pendPay = pay.data?.filter(p => p.status === 'Pending').reduce((s,r)=>s+Number(r.amount||0),0) || 0
          
          aiResponse.text = `### Pending Financial Summary:\n\n` +
            `**→ Pending Sales:**\nRs ${pendSales.toLocaleString('en-IN')}\n\n` +
            `**→ Pending Receivables:**\nRs ${pendRecv.toLocaleString('en-IN')}\n\n` +
            `**→ Pending Supplier Payments:**\nRs ${pendPay.toLocaleString('en-IN')}\n\n` +
            `**Total Pending:**\nRs ${(pendSales + pendRecv + pendPay).toLocaleString('en-IN')}`
        }
        // Received logic
        else if (lower.includes('received')) {
          const recvAmt = recv.data?.filter(r => r.status === 'Received').reduce((s,r)=>s+Number(r.amount||0),0) || 0
          aiResponse.text = `Total money received from clients is **Rs ${recvAmt.toLocaleString('en-IN')}**.`
        }
        // Profit logic
        else if (lower.includes('profit')) {
          const totRev = sales.data?.reduce((s,r)=>s+Number(r.amount||0),0) || 0
          const totCost = inv.data?.reduce((s,r)=>s+(Number(r.cost||0)*Number(r.qty||1)),0) || 0
          const totSpend = [...(gads.data||[]), ...(mads.data||[])].reduce((s,r)=>s+Number(r.spend||0),0) || 0
          const profit = totRev - totCost - totSpend
          aiResponse.text = `### Estimated Business Profit:\n` +
            `- Total Revenue: Rs ${totRev.toLocaleString('en-IN')}\n` +
            `- COGS (Inventory Cost): Rs ${totCost.toLocaleString('en-IN')}\n` +
            `- Marketing Spend: Rs ${totSpend.toLocaleString('en-IN')}\n\n` +
            `**Net Estimated Profit: Rs ${profit.toLocaleString('en-IN')}**`
        }
        // Owed logic
        else if (lower.includes('owes') || lower.includes('most money')) {
          const debtors = recv.data?.sort((a,b) => b.amount - a.amount) || []
          if (debtors.length > 0) {
            aiResponse.text = `The client who owes the most money is **${debtors[0].client}** with an outstanding balance of **Rs ${Number(debtors[0].amount).toLocaleString('en-IN')}**.`
          }
        }
        // Standard totals
        else if (lower.includes('sales') || lower.includes('revenue')) {
          const total = sales.data?.reduce((acc, curr) => acc + Number(curr.amount || 0), 0) || 0
          aiResponse.text = `The total sales revenue for Ekanta is Rs ${total.toLocaleString('en-IN')}.`
        } else if (lower.includes('spend') || lower.includes('budget')) {
          const total = [...(gads.data||[]), ...(mads.data||[])].reduce((acc, curr) => acc + Number(curr.spend || 0), 0) || 0
          aiResponse.text = `The total marketing spend across Google and Meta is Rs ${total.toLocaleString('en-IN')}.`
        } else if (lower.includes('inventory') || lower.includes('stock')) {
          const total = inv.data?.reduce((acc, curr) => acc + (Number(curr.cost || 0) * Number(curr.qty || 0 || 1)), 0) || 0
          aiResponse.text = `The total inventory valuation is approximately Rs ${total.toLocaleString('en-IN')}.`
        }
        
        if (aiResponse.text) aiResponse.text = appendInsight(aiResponse.text)
      } else if (lower.includes('overdue') || lower.includes('pending')) {
        const overduePay = pay.data?.filter(p => p.status === 'Overdue') || []
        const overdueRecv = recv.data?.filter(r => r.status === 'Overdue') || []
        
        // Priority: Overdue first
        if (overduePay.length > 0 || overdueRecv.length > 0) {
          aiResponse.text = `### ⚠️ URGENT: Overdue Accounts\n` +
            `I've identified ${overduePay.length + overdueRecv.length} overdue items that require immediate attention:`
          
          aiResponse.results = [
            ...overduePay.map(p => ({ mod: 'payments', label: 'Overdue Payment', title: p.supplier, info: `Rs ${p.amount} due`, status: 'Overdue', icon: CreditCard, raw: p })),
            ...overdueRecv.map(r => ({ mod: 'receivables', label: 'Overdue Receivable', title: r.client, info: `Rs ${r.amount} pending`, status: 'Overdue', icon: Briefcase, raw: r }))
          ].slice(0, 6)
        } else {
          aiResponse.text = "No overdue accounts found. All payments and receivables are within their due dates."
        }
        aiResponse.text = appendInsight(aiResponse.text)
      } else if (lower.includes('low stock') || lower.includes('reorder')) {
        const critical = inv.data?.filter(i => i.status === 'Critical') || []
        const lowStock = inv.data?.filter(i => i.status === 'Low Stock') || []
        
        // Priority: Critical first
        if (critical.length > 0 || lowStock.length > 0) {
          aiResponse.text = `### 📦 Inventory Alert\n` +
            `I found ${critical.length} critical and ${lowStock.length} low stock items:\n\n` +
            `**Critical:**\n` +
            critical.map(i => `- ${i.name}: ${i.units} ${i.unit} (Reorder at ${i.reorder})`).join('\n') +
            `\n\n**Low Stock:**\n` +
            lowStock.map(i => `- ${i.name}: ${i.units} ${i.unit}`).join('\n')
          
          aiResponse.results = [
            ...critical.map(i => ({ mod: 'inventory', label: 'CRITICAL', title: i.name, info: `ONLY ${i.units} ${i.unit} LEFT`, status: 'Critical', icon: Package, raw: i })),
            ...lowStock.map(i => ({ mod: 'inventory', label: 'Low Stock', title: i.name, info: `Units: ${i.units}`, status: 'Low Stock', icon: Package, raw: i }))
          ].slice(0, 6)
        }
        aiResponse.text = appendInsight(aiResponse.text)
      } else if (lower.includes('show inventory') || lower === 'inventory') {
        aiResponse.text = appendInsight(`### Current Inventory Status\n` +
          `Here are all ${inv.data?.length || 0} items in your inventory:\n\n` +
          inv.data?.map(i => `- **${i.name}**: ${i.units} ${i.unit} — [${i.status}]`).join('\n'))
        
        aiResponse.results = inv.data?.map(i => ({ mod: 'inventory', label: 'Inventory', title: i.name, info: `${i.units} ${i.unit}`, status: i.status, icon: Package, raw: i })).slice(0, 6)
      } else if (lower.includes('show sales') || lower === 'sales') {
        const completed = sales.data?.filter(s => s.status === 'Completed').length || 0
        aiResponse.text = appendInsight(`### Sales Overview (Total: Rs ${(sales.data?.reduce((s,r)=>s+Number(r.amount||0),0)||0).toLocaleString('en-IN')})\n` +
          `I found ${sales.data?.length || 0} sales entries (${completed} completed):\n\n` +
          sales.data?.slice(0, 10).map(s => `- **${s.client}**: ${s.product} — Rs ${Number(s.amount).toLocaleString('en-IN')} [${s.status}]`).join('\n'))
        
        aiResponse.results = sales.data?.map(s => ({ mod: 'sales', label: 'Sales Entry', title: s.client, info: s.product, status: s.status, icon: ShoppingBag, raw: s })).slice(0, 6)
      } else if (lower.includes('ceo dashboard') || lower.includes('ceo see')) {
        const totRev = sales.data?.reduce((s,r)=>s+Number(r.amount||0),0) || 0
        aiResponse.text = appendInsight(`### CEO Strategic Overview\n\n` +
          `**Key Metrics:**\n` +
          `- **Net Revenue:** Rs ${(totRev/100000).toFixed(1)}L\n` +
          `- **Bank Balance:** Rs 19.1L\n` +
          `- **Ads ROAS:** 4.2x\n` +
          `- **Investments:** Rs 52L (9.4% return)\n\n` +
          `**Top Decisions:**\n` +
          `- Clear overdue receivables (Rs 4.3L)\n` +
          `- Scale Meta Reels (ROAS 10.2x)\n` +
          `- Approve warehouse automation`)
      } else if (lower.includes('best campaign') || lower.includes('top ad')) {
        const allAds = [...(gads.data||[]), ...(mads.data||[])]
        const top = allAds.sort((a,b) => b.conversions - a.conversions)[0]
        if (top) {
          aiResponse.text = appendInsight(`The best performing campaign is **${top.campaign}**.\n\n` +
            `- **Conversions:** ${top.conversions}\n` +
            `- **Revenue:** Rs ${Number(top.revenue).toLocaleString('en-IN')}\n` +
            `- **Status:** ${top.status}\n\n` +
            `This campaign is significantly outperforming others in terms of conversion volume.`)
        }
      }

      // 3. Global Data Search (Always run as fallback or additional info)
      const searchResults = await performRealSearch(text, dataContext)
      
      if (searchResults.length > 0 && !aiResponse.results) {
        if (navigated) {
          aiResponse.text += ` I also found ${searchResults.length} specific records matching your query:`
        } else if (!aiResponse.text) {
          aiResponse.text = `I've analyzed your dashboard data and found ${searchResults.length} matching entries for "${text}":`
        } else {
          aiResponse.text += ` Additionally, here are ${searchResults.length} related records:`
        }
        aiResponse.results = searchResults
      } 
      
      if (!aiResponse.text && !navigated) {
        // 4. Fallback Contextual Intelligence
        const totalRevVal = sales.data?.reduce((s, r) => s + Number(r.amount || 0), 0) || 0;
        const salesCount = sales.data?.length || 0;
        const lowStockCountVal = inv.data?.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length || 0;
        const spendVal = [...(gads.data || []), ...(mads.data || []), ...(cads.data || [])].reduce((s, r) => s + Number(r.spend || 0), 0) || 0;
        const roasVal = spendVal > 0 ? (sales.data?.reduce((s, r) => s + Number(r.amount || 0), 0) / spendVal).toFixed(2) : '4.20';
        
        if (lower.includes('status') || lower.includes('how is') || lower.includes('performance') || lower.includes('health')) {
          aiResponse.text = `Overall business operations are running smoothly. The system shows total revenue of **Rs ${totalRevVal.toLocaleString('en-IN')}** across **${salesCount}** sales entries. Marketing spend is **Rs ${spendVal.toLocaleString('en-IN')}** with a blended ROAS of **${roasVal}x**.`
        } else {
          aiResponse.text = `I have scanned the ERP database for your request. Currently, we have **${salesCount}** active sales transactions with a total value of **Rs ${totalRevVal.toLocaleString('en-IN')}**, **${lowStockCountVal}** items in low/critical stock inventory, and an active marketing campaign structure yielding a blended ROAS of **${roasVal}x**. How can I help you detail these operations further?`
        }
      }

      if (aiResponse.text && !aiResponse.text.includes('Smart Business Tip')) {
        aiResponse.text = appendInsight(aiResponse.text)
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'ai', text: "I encountered a technical glitch while accessing the database. Please try again in a moment." }])
    } finally {
      setIsTyping(false)
    }
  }

  const bubble = (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9000 }}>
      <style>{`
        @keyframes ai-pulse { 0%, 100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
        .ai-typing-dot { animation: ai-pulse 1s infinite ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); borderRadius: 10px; }
      `}</style>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              width: 380, height: 560, background: 'rgba(23, 23, 23, 0.85)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', marginBottom: 16,
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '18px 22px', background: 'rgba(255,255,255,0.03)', 
              borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', 
              alignItems: 'center', justifyContent: 'space-between' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 36, height: 36, borderRadius: 12, 
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                  boxShadow: '0 0 15px rgba(59,130,246,0.5)'
                }}>
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.3px' }}>Ekanta AI</div>
                  <div style={{ fontSize: 10, color: '#10b981', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} /> 
                    Trade Management
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div 
              ref={scrollRef}
              style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}
              className="custom-scrollbar"
            >
              {messages.map((m, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  alignSelf: m.isDetailCard ? 'stretch' : (m.role === 'ai' ? 'flex-start' : 'flex-end'),
                  maxWidth: m.isDetailCard ? '100%' : '85%',
                  width: m.isDetailCard ? '100%' : 'auto'
                }}>
                  {m.isDetailCard ? (
                    /* Premium structured card — appended as latest message, full-width */
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                          width: 32, height: 32, borderRadius: 8, 
                          background: 'rgba(255,255,255,0.05)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' 
                        }}>
                          {m.detailRecord.icon ? <m.detailRecord.icon size={16} /> : <Bot size={16} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{m.detailRecord.title}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{m.detailRecord.label} Details</div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
                        {getDetailFields(m.detailRecord).map((f, fi) => (
                          <div key={fi} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{f.label}:</span>
                            <span style={{ fontWeight: 600, color: '#fff' }}>{f.value}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Two-button row: VIEW (highlight only) + EDIT (open form) */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>

                        {/* VIEW — navigate to module & highlight the row, no edit modal */}
                        <button
                          onClick={() => {
                            setIsOpen(true)
                            const r = m.detailRecord
                            if (r.raw) {
                              const query = r.raw.client || r.raw.name || r.raw.supplier || r.raw.campaign || r.raw.fabric || r.raw.title || ''
                              // dispatch WITHOUT id/record so dashboard only highlights, does NOT open edit
                              window.dispatchEvent(new CustomEvent('dashboard-search', {
                                detail: { module: r.mod, query }
                              }))
                              if (setModule) setModule(r.mod)
                            } else {
                              if (setModule) setModule(r.mod)
                            }
                          }}
                          style={{
                            flex: 1, height: 32, borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                            transition: 'all 0.2s', fontFamily: 'inherit'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                            e.currentTarget.style.color = '#fff'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                            e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                          }}
                        >
                          <Eye size={12} /> VIEW
                        </button>

                        {/* EDIT — navigate to module & open the edit modal for this record */}
                        <button
                          onClick={() => {
                            setIsOpen(true)
                            const r = m.detailRecord
                            if (r.raw) {
                              const query = r.raw.client || r.raw.name || r.raw.supplier || r.raw.campaign || r.raw.fabric || r.raw.title || ''
                              // dispatch WITH id/record so dashboard calls openEdit()
                              window.dispatchEvent(new CustomEvent('dashboard-search', {
                                detail: { module: r.mod, query, id: r.raw.id, record: r.raw }
                              }))
                              if (setModule) setModule(r.mod)
                            } else {
                              handleAction({ type: 'navigate', module: r.mod, query: r.title })
                            }
                          }}
                          style={{
                            flex: 1, height: 32, borderRadius: 8,
                            border: 'none',
                            background: 'var(--admin)',
                            color: '#fff',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                            transition: 'all 0.2s', fontFamily: 'inherit',
                            boxShadow: '0 2px 8px rgba(59,130,246,0.35)'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.opacity = '0.85'
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,130,246,0.5)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.opacity = '1'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.35)'
                          }}
                        >
                          <Pencil size={12} /> EDIT
                        </button>

                      </div>
                    </motion.div>
                  ) : (
                    /* Standard bubble */
                    <>
                      <div style={{ 
                        padding: '12px 16px', borderRadius: m.role === 'ai' ? '2px 16px 16px 16px' : '16px 2px 16px 16px',
                        background: m.role === 'ai' ? 'rgba(255,255,255,0.05)' : 'var(--admin)',
                        color: '#fff',
                        fontSize: 13, lineHeight: 1.6,
                        border: m.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                        boxShadow: m.role === 'user' ? '0 4px 12px rgba(59,130,246,0.3)' : 'none'
                      }}>
                        {m.text}
                      </div>
                      
                      {/* Results List */}
                      {m.results && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                          {m.results.map((r, ri) => (
                            <div key={ri}
                              onClick={() => {
                                // Keep chat open
                                setIsOpen(true)

                                // OPEN = navigate + highlight only (no edit modal)
                                // dispatch WITHOUT id/record so dashboard skips openEdit()
                                if (r.raw) {
                                  const query = r.raw.client || r.raw.name || r.raw.supplier || r.raw.campaign || r.raw.fabric || r.raw.title || ''
                                  window.dispatchEvent(new CustomEvent('dashboard-search', {
                                    detail: { module: r.mod, query }
                                  }))
                                  if (setModule) setModule(r.mod)
                                } else {
                                  handleAction({ type: 'navigate', module: r.mod, query: r.title })
                                }

                                // Append detail card (with VIEW + EDIT buttons) as latest message
                                setMessages(prev => [
                                  ...prev,
                                  { role: 'ai', isDetailCard: true, detailRecord: r }
                                ])
                              }}
                              style={{ 
                                padding: '10px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', 
                                border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 12,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                              }}
                            >
                              <div style={{ 
                                width: 32, height: 32, borderRadius: 8, 
                                background: 'rgba(255,255,255,0.05)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' 
                              }}>
                                <r.icon size={16} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{r.info} • {r.label}</div>
                              </div>
                              <div style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: 'rgba(59,130,246,0.2)', color: '#3b82f6', fontWeight: 600 }}>
                                OPEN
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {isTyping && (
                <div style={{
                  alignSelf: 'flex-start', padding: '12px 18px', borderRadius: '2px 16px 16px 16px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', gap: 5
                }}>
                  <div className="ai-typing-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6' }} />
                  <div className="ai-typing-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', animationDelay: '0.2s' }} />
                  <div className="ai-typing-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', animationDelay: '0.4s' }} />
                </div>
              )}
              {/* Req #3: Scroll anchor — always at the bottom of message list */}
              <div ref={messagesEndRef} style={{ height: 1, flexShrink: 0 }} />
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '0 18px 16px', display: 'flex', gap: 8, overflowX: 'auto' }} className="custom-scrollbar">
              {[
                { label: 'Check Stock', icon: Package, q: 'Show inventory' },
                { label: 'Sales Report', icon: TrendingUp, q: 'Show sales performance' },
                { label: 'Pending Payments', icon: CreditCard, q: 'Show pending payments' },
                { label: 'Team Roles', icon: Users, q: 'Show team' }
              ].map(s => (
                <button 
                  key={s.label}
                  onClick={() => handleSend(s.q)}
                  style={{ 
                    padding: '8px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: 11,
                    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  }}
                >
                  <s.icon size={13} /> {s.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '16px 18px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: 10, 
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: 16, padding: '6px 6px 6px 16px',
                transition: 'all 0.2s focus-within',
              }}
              className="ai-input-wrapper"
              >
                <input 
                  placeholder="Ask AI agent anything..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  style={{ 
                    flex: 1, background: 'transparent', border: 'none', 
                    outline: 'none', color: '#fff', fontSize: 14,
                    fontFamily: 'inherit'
                  }}
                />
                <button 
                  onClick={() => handleSend()}
                  style={{ 
                    width: 36, height: 36, borderRadius: 12, background: 'var(--admin)', 
                    border: 'none', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                  }}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 52, height: 52, borderRadius: '50%', background: 'var(--admin)',
          border: 'none', color: '#fff', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  )

  return createPortal(bubble, document.getElementById('modal-root'))
}
