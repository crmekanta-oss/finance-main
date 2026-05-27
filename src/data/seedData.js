// ── ADMIN DATA ──────────────────────────────────────────────────────────
export const initSales = [
  // Last 7 Days (populates Mon-Sun trend)
  { id:1, date:'2026-05-18', client:'Fashionista Ltd',  product:'Cotton Kurta',    qty:120, amount:42000,  status:'Completed' }, // Mon
  { id:2, date:'2026-05-19', client:'Urban Wear',        product:'Denim Jacket',   qty:60,  amount:68000,  status:'Completed' }, // Tue
  { id:3, date:'2026-05-20', client:'Style Hub',         product:'Silk Saree',     qty:30,  amount:51000,  status:'Pending'   }, // Wed
  { id:4, date:'2026-05-21', client:'Trend Factory',     product:'Polyester Shirt',qty:200, amount:79000,  status:'Completed' }, // Thu
  { id:5, date:'2026-05-22', client:'Fabric World',      product:'Linen Pants',    qty:80,  amount:63000,  status:'Pending'   }, // Fri
  { id:6, date:'2026-05-23', client:'Rajan Fabrics',     product:'Cotton Premium', qty:120, amount:88000,  status:'Completed' }, // Sat
  { id:7, date:'2026-05-24', client:'Meena Exports',     product:'Silk Blend',     qty:80,  amount:34000,  status:'Pending'   }, // Sun
  
  // Today's Data (May 25)
  { id:8, date:'2026-05-25', client:'Shobitam',          product:'Kuurtis',        qty:1,   amount:23200,  status:'Open'      },
  { id:9, date:'2026-05-25', client:'Shobitam',          product:'Half Sarees',    qty:1,   amount:18000,  status:'Completed' },
  
  // Older Data (Last 30 Days)
  { id:10,date:'2026-05-10', client:'Krishna Traders',   product:'Linen Pure',     qty:200, amount:54000,  status:'Completed' },
  { id:11,date:'2026-05-05', client:'Priya Mills',       product:'Polyester Mix',  qty:300, amount:42000,  status:'Overdue'   },
  { id:12,date:'2026-05-01', client:'Arjun Clothiers',   product:'Cotton Premium', qty:150, amount:48000,  status:'Completed' },
]

export const initInventory = [
  { id:1, name:'Cotton Twill 240gsm', category:'Cotton',    units:2400, unit:'metres', reorder_level:500, purchase_price:180, selling_price:450, stock_status:'In Stock', sku:'EK-CT-001', supplier_name:'Raghav Textiles' },
  { id:2, name:'Polyester Satin',      category:'Synthetic', units:980,  unit:'metres', reorder_level:300, purchase_price:120, selling_price:320, stock_status:'Low Stock', sku:'EK-PS-002', supplier_name:'SK Yarns' },
  { id:3, name:'Silk Organza',         category:'Silk',      units:460,  unit:'metres', reorder_level:200, purchase_price:650, selling_price:1250, stock_status:'Low Stock', sku:'EK-SO-003', supplier_name:'Mitra Fabrics' },
  { id:4, name:'Denim Heavy 12oz',     category:'Denim',     units:1600, unit:'metres', reorder_level:400, purchase_price:210, selling_price:580, stock_status:'In Stock', sku:'EK-DH-004', supplier_name:'Loom & Co' },
  { id:5, name:'Linen Natural',        category:'Linen',     units:120,  unit:'metres', reorder_level:300, purchase_price:290, selling_price:720, stock_status:'Critical', sku:'EK-LN-005', supplier_name:'Weave Masters' },
  { id:6, name:'Wool Blend Fine',      category:'Wool',      units:800,  unit:'metres', reorder_level:200, purchase_price:480, selling_price:1150, stock_status:'In Stock', sku:'EK-WB-006', supplier_name:'Arjun Clothiers' },
]

export const initPayments = [
  { id:1, supplier:'Raghav Textiles', invoice:'INV-001', total_amount:120000, paid_amount:120000, pending_amount:0, invoice_date:'2026-05-01', due:'2026-05-10', status:'Paid', payment_method:'Bank Transfer' },
  { id:2, supplier:'Mitra Fabrics',   invoice:'INV-002', total_amount:84500,  paid_amount:0,      pending_amount:84500, invoice_date:'2026-05-10', due:'2026-05-20', status:'Pending', payment_method:'UPI' },
  { id:3, supplier:'SK Yarns',        invoice:'INV-003', total_amount:230000, paid_amount:50000,  pending_amount:180000, invoice_date:'2026-04-15', due:'2026-04-30', status:'Overdue', payment_method:'Cheque' },
  { id:4, supplier:'Loom & Co',       invoice:'INV-004', total_amount:67000,  paid_amount:67000,  pending_amount:0, invoice_date:'2026-05-12', due:'2026-05-22', status:'Paid', payment_method:'Bank Transfer' },
  { id:5, supplier:'Weave Masters',   invoice:'INV-005', total_amount:95000,  paid_amount:0,      pending_amount:95000, invoice_date:'2026-05-18', due:'2026-05-28', status:'Pending', payment_method:'UPI' },
]

export const initReceivables = [
  // Collected (Received)
  { id:1, client:'Fashionista Ltd', invoice:'REC-001', amount:340000, due:'2026-05-08', status:'Received' },
  { id:2, client:'Urban Wear',       invoice:'REC-002', amount:180000, due:'2026-05-05', status:'Received' },
  
  // Outstanding (Pending / Overdue)
  { id:3, client:'Style Hub',        invoice:'REC-003', amount:90500,  due:'2026-04-28', status:'Overdue'  },
  { id:4, client:'Trend Factory',    invoice:'REC-004', amount:125000, due:'2026-05-18', status:'Pending'  },
  { id:5, client:'Fabric World',     invoice:'REC-005', amount:67500,  due:'2026-05-25', status:'Pending'  },
  { id:6, client:'Shobitam',          invoice:'REC-006', amount:41200,  due:'2026-05-26', status:'Pending'  },
]

export const initFabric = [
  { id:1, fabric:'Cotton Twill 240gsm', qty:'800 m',  supplier:'Raghav Textiles', order_date:'2026-05-01', delivery:'2026-05-15', amount:144000, status:'In Transit' },
  { id:2, fabric:'Polyester Satin',      qty:'500 m',  supplier:'SK Yarns',        order_date:'2026-05-05', delivery:'2026-05-20', amount:60000,  status:'Ordered'    },
  { id:3, fabric:'Silk Organza',         qty:'200 m',  supplier:'Mitra Fabrics',   order_date:'2026-05-06', delivery:'2026-05-24', amount:130000, status:'Ordered'    },
  { id:4, fabric:'Denim 12oz',           qty:'600 m',  supplier:'Loom & Co',       order_date:'2026-04-28', delivery:'2026-05-10', amount:126000, status:'Delivered'  },
]

export const initTeam = [
  { id:1, name:'Rajesh Kumar', role:'CEO', joined:'2020-01-15', status:'Active' },
  { id:2, name:'Priya Sharma', role:'Admin', joined:'2021-03-10', status:'Active' },
  { id:3, name:'Amit Singh', role:'Admin', joined:'2022-06-01', status:'Active' },
  { id:4, name:'Sneha Patel', role:'Marketing', joined:'2021-11-20', status:'Active' },
  { id:5, name:'Vikram Nair', role:'Marketing', joined:'2023-02-14', status:'Active' },
  { id:6, name:'Deepa Rao', role:'Marketing', joined:'2023-08-05', status:'Active' },
]

// ── MARKETING DATA ──────────────────────────────────────────────────────
// created_at dates are set relative to today (2026-05-27) so date filters work:
//   Today  = 2026-05-27
//   7 Days = 2026-05-20 to 2026-05-27
//   30 Days= 2026-04-27 to 2026-05-27
export const initGoogleAds = [
  { id:1, campaign:'Brand Search',      type:'Search',  budget:35000, spend:35000, clicks:8200,  impressions:100000, conversions:120, revenue:456000, status:'Active', created_at:'2026-05-27T09:00:00.000Z' },
  { id:2, campaign:'Product Keywords',  type:'Search',  budget:50000, spend:45000, clicks:12400, impressions:203000, conversions:140, revenue:560000, status:'Active', created_at:'2026-05-22T10:00:00.000Z' },
  { id:3, campaign:'Display Retarget',  type:'Display', budget:30000, spend:25000, clicks:5800,  impressions:118000, conversions:54,  revenue:162000, status:'Paused', created_at:'2026-05-10T11:00:00.000Z' },
  { id:4, campaign:'Shopping Ads',      type:'Shopping',budget:20000, spend:15000, clicks:1600,  impressions:29000,  conversions:26,  revenue:78000,  status:'Active', created_at:'2026-04-20T08:00:00.000Z' },
]

export const initMetaAds = [
  { id:1, campaign:'Facebook Feed',      type:'Feed',     budget:35000, spend:30000, reach:120000, impressions:180000, conversions:110, revenue:330000, status:'Active', created_at:'2026-05-27T09:30:00.000Z' },
  { id:2, campaign:'Instagram Stories',  type:'Stories',  budget:30000, spend:25000, reach:98000,  impressions:140000, conversions:85,  revenue:255000, status:'Active', created_at:'2026-05-24T10:00:00.000Z' },
  { id:3, campaign:'Reels Boost',        type:'Reels',    budget:20000, spend:18000, reach:92000,  impressions:128000, conversions:62,  revenue:186000, status:'Active', created_at:'2026-05-08T11:00:00.000Z' },
  { id:4, campaign:'Lookalike Audience', type:'Audience', budget:15000, spend:12000, reach:50000,  impressions:72000,  conversions:33,  revenue:99000,  status:'Paused', created_at:'2026-04-18T08:00:00.000Z' },
]

export const initCommunicationAds = [
  { id:1, campaign:'Eid Collection Blast', type:'WhatsApp', budget:10000, spend:7500, reach:12000, conversions:320, revenue:96000,  status:'Completed', created_at:'2026-05-27T08:00:00.000Z' },
  { id:2, campaign:'New Arrivals SMS',     type:'SMS',      budget:5000,  spend:4200, reach:18000, conversions:180, revenue:54000,  status:'Active',    created_at:'2026-05-23T09:00:00.000Z' },
  { id:3, campaign:'Monthly Newsletter',   type:'Email',    budget:4000,  spend:2800, reach:9500,  conversions:95,  revenue:28500,  status:'Active',    created_at:'2026-05-14T10:00:00.000Z' },
  { id:4, campaign:'Festival Offer Alert', type:'WhatsApp', budget:8000,  spend:5500, reach:10000, conversions:410, revenue:123000, status:'Active',    created_at:'2026-05-27T11:00:00.000Z' },
]

// ── CEO DATA ─────────────────────────────────────────────────────────────
export const ceoStats = [
  { label:'Net Revenue',   value:'₹38.4L', change:'15.2% YoY', up:true  },
  { label:'Bank Balance',  value:'₹19.1L', change:'Healthy',    up:true  },
  { label:'Ads ROAS',      value:'4.2×',   change:'Improving',  up:true  },
  { label:'Investment',    value:'₹52L',   change:'9.4% return',up:true  },
]

export const investments = [
  { id:1, name:'Equity Holdings', value:'₹28L', change:'+11.2%', up:true  },
  { id:2, name:'Fixed Deposits',  value:'₹16L', change:'+7.0%',  up:true  },
  { id:3, name:'Working Capital', value:'₹8L',  change:'−2.1%',  up:false },
]

export const decisions = [
  { dot:'#22c55e', title:'Increase fabric orders 20%',   body:'Silk Blend & Polyester below threshold. Reorder from Mitra and SK Yarns recommended to avoid stockout.' },
  { dot:'#f97316', title:'Clear overdue receivables',    body:'₹4.3L overdue from 3 clients. Escalate Style Hub follow-up — 23 days past due date.' },
  { dot:'#3b82f6', title:'Scale Meta Ads spend',         body:'Meta ROAS 4.9× is highest performer. Recommend budget increase of ₹40,000 for Instagram Reels.' },
  { dot:'#a855f7', title:'Approve warehouse automation', body:'₹45L capex for automated picking system. Vendor: GreyOrange. Projected 18-month payback period.' },
]

export const salesChartData = [
  { day:'Mon', sales:42000 }, { day:'Tue', sales:68000 }, { day:'Wed', sales:51000 },
  { day:'Thu', sales:79000 }, { day:'Fri', sales:63000 }, { day:'Sat', sales:88000 },
  { day:'Sun', sales:34000 },
]

// ── FORM SCHEMAS ─────────────────────────────────────────────────────────
export const FORM_SCHEMAS = {
  sales_entries: [
    { key:'date',    label:'Date',     type:'date'   },
    { key:'client',  label:'Client',   type:'search-select', options:['Shobitam', 'Taamara Silks', 'Website Clients', 'Ethnic Trends', 'Silk Collections', 'Fashion Boutique', 'Other Clients'] },
    { key:'product', label:'Product',  type:'search-select', options:['Kitwire', 'Kuurtis', 'Half Sarees', 'Dress Collections', 'Silk Sarees', 'Bridal Wear', 'Party Wear', 'Other Products'] },
    { key:'qty',     label:'Quantity', type:'number', placeholder:'e.g. 120' },
    { key:'amount',  label:'Amount (₹)', type:'number', placeholder:'e.g. 50000' },
    { key:'status',  label:'Status',   type:'select', options:['Pending','Completed','Overdue'] },
  ],
  inventory: [
    { key:'name',           label:'Item Name',  type:'text',   placeholder:'e.g. Cotton Twill' },
    { key:'sku',            label:'SKU Code',   type:'text',   placeholder:'e.g. EK-CT-001' },
    { key:'barcode',        label:'Barcode',    type:'text',   placeholder:'e.g. 8901234...' },
    { key:'category',       label:'Category',   type:'text',   placeholder:'e.g. Cotton' },
    { key:'purchase_price', label:'Purchase Price (₹)', type:'number', placeholder:'e.g. 180' },
    { key:'selling_price',  label:'Selling Price (₹)', type:'number', placeholder:'e.g. 450' },
    { key:'warehouse_loc',  label:'Warehouse Location', type:'text', placeholder:'e.g. Aisle 4, Shelf B' },
    { key:'units',          label:'Units',      type:'number', placeholder:'e.g. 1000' },
    { key:'unit',           label:'Unit Type',  type:'text',   placeholder:'e.g. metres' },
    { key:'reorder_level',  label:'Reorder Level', type:'number', placeholder:'e.g. 300' },
    { key:'supplier_name',  label:'Supplier Name', type:'text', placeholder:'e.g. Raghav Textiles' },
    { key:'contact_num',    label:'Contact Number', type:'text', placeholder:'e.g. +91...' },
    { key:'supplier_email', label:'Supplier Email', type:'email', placeholder:'e.g. info@supplier.com' },
    { key:'address',        label:'Address',       type:'text', placeholder:'Supplier address' },
    { key:'stock_status',   label:'Stock Status',  type:'select', options:['In Stock','Low Stock','Critical','Out of Stock'] },
  ],
  supplier_payments: [
    { key:'supplier',       label:'Supplier',      type:'text',   placeholder:'Supplier name' },
    { key:'invoice',        label:'Invoice No.',   type:'text',   placeholder:'e.g. INV-007' },
    { key:'invoice_date',   label:'Invoice Date',  type:'date' },
    { key:'paid_date',      label:'Paid Date',     type:'date' },
    { key:'transaction_date', label:'Transaction Date', type:'date' },
    { key:'transaction_details', label:'Transaction Details', type:'text', placeholder:'Reference / UTR Number' },
    { key:'total_amount',   label:'Total Amount (₹)', type:'number', placeholder:'e.g. 100000' },
    { key:'paid_amount',    label:'Paid Amount (₹)',  type:'number', placeholder:'e.g. 60000' },
    { key:'pending_amount', label:'Pending Amount (₹)', type:'number', placeholder:'e.g. 40000' },
    { key:'due',            label:'Due Date',      type:'date'   },
    { key:'payment_method', label:'Payment Method', type:'select', options:['Bank Transfer', 'UPI', 'Cheque', 'Cash'] },
    { key:'status',         label:'Payment Status', type:'select', options:['Pending','Paid','Overdue'] },
  ],
  receivables: [
    { key:'client',  label:'Client',       type:'text',   placeholder:'Client name' },
    { key:'invoice', label:'Invoice No.',  type:'text',   placeholder:'e.g. REC-007' },
    { key:'amount',  label:'Amount (₹)',   type:'number', placeholder:'e.g. 80000' },
    { key:'due',     label:'Due Date',     type:'date'   },
    { key:'status',  label:'Status',       type:'select', options:['Pending','Received','Overdue'] },
  ],
  fabric_orders: [
    { key:'fabric',     label:'Fabric Name',  type:'text',   placeholder:'e.g. Cotton Twill' },
    { key:'qty',        label:'Quantity',      type:'text',   placeholder:'e.g. 500 m' },
    { key:'supplier',   label:'Supplier',      type:'text',   placeholder:'Supplier name' },
    { key:'order_date', label:'Order Date',    type:'date'   },
    { key:'delivery',   label:'Delivery Date', type:'date'   },
    { key:'amount',     label:'Amount (₹)',    type:'number', placeholder:'e.g. 90000' },
    { key:'status',     label:'Status',        type:'select', options:['Ordered','In Transit','Delivered','Cancelled'] },
  ],
  google_ads: [
    { key:'campaign',     label:'Campaign Name', type:'text',   placeholder:'e.g. Brand Search' },
    { key:'type',         label:'Type',           type:'select', options:['Search','Display','Shopping','Video'] },
    { key:'budget',       label:'Budget (₹)',     type:'number', placeholder:'e.g. 30000' },
    { key:'spend',        label:'Spend (₹)',       type:'number', placeholder:'e.g. 25000' },
    { key:'clicks',       label:'Clicks',          type:'number', placeholder:'e.g. 5000' },
    { key:'conversions',  label:'Conversions',     type:'number', placeholder:'e.g. 100' },
    { key:'revenue',      label:'Revenue (₹)',     type:'number', placeholder:'e.g. 250000' },
    { key:'status',       label:'Status',           type:'select', options:['Active','Paused','Ended'] },
  ],
  meta_ads: [
    { key:'campaign',    label:'Campaign Name', type:'text',   placeholder:'e.g. Facebook Feed' },
    { key:'type',        label:'Type',           type:'select', options:['Feed','Stories','Reels','Audience','Carousel'] },
    { key:'budget',      label:'Budget (₹)',     type:'number', placeholder:'e.g. 25000' },
    { key:'spend',       label:'Spend (₹)',       type:'number', placeholder:'e.g. 20000' },
    { key:'reach',       label:'Reach',           type:'number', placeholder:'e.g. 80000' },
    { key:'conversions', label:'Conversions',     type:'number', placeholder:'e.g. 80' },
    { key:'revenue',     label:'Revenue (₹)',     type:'number', placeholder:'e.g. 200000' },
    { key:'status',      label:'Status',           type:'select', options:['Active','Paused','Ended'] },
  ],
  communication_ads: [
    { key:'campaign',    label:'Campaign Name', type:'text',   placeholder:'e.g. WhatsApp Broadcast' },
    { key:'type',        label:'Type',           type:'select', options:['WhatsApp','SMS','Email','Direct'] },
    { key:'budget',      label:'Budget (₹)',     type:'number', placeholder:'e.g. 15000' },
    { key:'spend',       label:'Spend (₹)',       type:'number', placeholder:'e.g. 12000' },
    { key:'reach',       label:'Reach',           type:'number', placeholder:'e.g. 50000' },
    { key:'conversions', label:'Conversions',     type:'number', placeholder:'e.g. 45' },
    { key:'revenue',     label:'Revenue (₹)',     type:'number', placeholder:'e.g. 150000' },
    { key:'status',      label:'Status',           type:'select', options:['Active','Paused','Ended'] },
  ],
  investments: [
    { key:'name', label:'Investment Name', type:'text', placeholder:'e.g. Equity Holdings' },
    { key:'type', label:'Investment Type', type:'text', placeholder:'e.g. Capex · Q3 2026' },
    { key:'val',  label:'Current Value',    type:'text', placeholder:'e.g. ₹80L' },
    { key:'note', label:'Performance Note', type:'text', placeholder:'e.g. ↑ 22.4% projected ROI' },
    { key:'up',   label:'Trending Up',      type:'select', options:['Yes', 'No', 'Neutral'] },
  ],
  users: [
    { key:'name',     label:'Full Name', type:'text',   placeholder:'e.g. Rajesh Arora' },
    { key:'username', label:'Username',  type:'text',   placeholder:'e.g. rajesh.arora' },
    { key:'password', label:'Password',  type:'password', placeholder:'Min 6 characters' },
    { key:'role',     label:'Role',      type:'select', options:['Admin','Marketing'] },
  ],
  strategic_decisions: [
    { key:'title', label:'Decision Title', type:'text', placeholder:'e.g. Scale Meta Ads spend' },
    { key:'body',  label:'Decision Details', type:'text', placeholder:'Describe the decision...' },
    { key:'dot',   label:'Priority Color',   type:'select', options:['#22c55e', '#f97316', '#3b82f6', '#a855f7'] },
  ],
}

// ── Extended chart data for richer visualisations ──────────────────────────
export const monthlyRevenue = [
  { month:'Jan', revenue:1200000, target:1100000, lastYear:980000 },
  { month:'Feb', revenue:1480000, target:1300000, lastYear:1120000 },
  { month:'Mar', revenue:1620000, target:1500000, lastYear:1340000 },
  { month:'Apr', revenue:1750000, target:1600000, lastYear:1480000 },
  { month:'May', revenue:1840000, target:1700000, lastYear:1560000 },
]

export const weeklyAdSpend = [
  { week:'W1', google:82000, meta:55000, comms:18000 },
  { week:'W2', google:95000, meta:62000, comms:22000 },
  { week:'W3', google:74000, meta:48000, comms:15000 },
  { week:'W4', google:103000, meta:71000, comms:28000 },
]
