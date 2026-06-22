// ── DATE HELPERS (relative to today so filters always work) ──────────────
const _d  = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0] }
const _f  = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0] }
const _dt = (n, h='09:00:00') => `${_d(n)}T${h}.000Z`

// ── ADMIN DATA ──────────────────────────────────────────────────────────

// Orders
export const initSales = [
  { id:1, date:_d(0), client:'Sanjay Kumar',  product:'Bridal Silk Saree', qty:5,  amount:12500, status:'Completed', created_at:_dt(0,'08:00:00') },
  { id:2, date:_d(0), client:'Arjun Raj',     product:'Cotton Kurta Set',  qty:10, amount:8200,  status:'Pending',   created_at:_dt(0,'09:30:00') },
  { id:3, date:_d(1), client:'Priya S',        product:'Linen Pants',       qty:15, amount:15000, status:'Completed', created_at:_dt(1,'10:00:00') },
  { id:4, date:_d(1), client:'Karthik V',      product:'Denim Jacket',      qty:8,  amount:6800,  status:'Pending',   created_at:_dt(1,'11:00:00') },
  { id:5, date:_d(2), client:'Divya R',        product:'Party Wear',        qty:4,  amount:4500,  status:'Overdue',   created_at:_dt(2,'09:00:00') },
]

// Inventory
export const initInventory = [
  { id:1, name:'Cotton Shirt', category:'Cotton',  units:150, unit:'pcs', reorder_level:50, purchase_price:250,  selling_price:650,  stock_status:'In Stock',  sku:'EK-CS-001', supplier_name:'ABC Textiles'   },
  { id:2, name:'Formal Shirt', category:'Formal',  units:120, unit:'pcs', reorder_level:40, purchase_price:350,  selling_price:900,  stock_status:'In Stock',  sku:'EK-FS-002', supplier_name:'Fashion Hub'    },
  { id:3, name:'Jeans',        category:'Denim',   units:95,  unit:'pcs', reorder_level:30, purchase_price:450,  selling_price:1200, stock_status:'Low Stock', sku:'EK-JN-003', supplier_name:'Trend Fabrics'  },
  { id:4, name:'T-Shirt',      category:'Casual',  units:200, unit:'pcs', reorder_level:80, purchase_price:150,  selling_price:400,  stock_status:'In Stock',  sku:'EK-TS-004', supplier_name:'Style Mills'    },
  { id:5, name:'Hoodie',       category:'Winter',  units:75,  unit:'pcs', reorder_level:25, purchase_price:550,  selling_price:1400, stock_status:'Low Stock', sku:'EK-HD-005', supplier_name:'Elite Garments' },
]

// Suppliers (amounts due to suppliers)
export const initPayments = [
  { id:1, supplier:'ABC Textiles',   invoice:'INV-001', total_amount:120000, paid_amount:0, pending_amount:120000, invoice_date:_d(10), due:_f(5),  payment_method:'Bank Transfer', status:'Pending', created_at:_dt(10) },
  { id:2, supplier:'Fashion Hub',    invoice:'INV-002', total_amount:85000,  paid_amount:0, pending_amount:85000,  invoice_date:_d(8),  due:_f(7),  payment_method:'UPI',           status:'Pending', created_at:_dt(8)  },
  { id:3, supplier:'Trend Fabrics',  invoice:'INV-003', total_amount:95000,  paid_amount:0, pending_amount:95000,  invoice_date:_d(15), due:_d(2),  payment_method:'Cheque',        status:'Overdue', created_at:_dt(15) },
  { id:4, supplier:'Style Mills',    invoice:'INV-004', total_amount:150000, paid_amount:0, pending_amount:150000, invoice_date:_d(20), due:_d(5),  payment_method:'Bank Transfer', status:'Overdue', created_at:_dt(20) },
  { id:5, supplier:'Elite Garments', invoice:'INV-005', total_amount:70000,  paid_amount:0, pending_amount:70000,  invoice_date:_d(5),  due:_f(10), payment_method:'UPI',           status:'Pending', created_at:_dt(5)  },
]

// Customers (receivables — money owed to us)
export const initReceivables = [
  { id:1, client:'Sanjay Kumar', invoice:'REC-001', amount:25000, due:_f(7),  status:'Pending',  created_at:_dt(2) },
  { id:2, client:'Arjun Raj',    invoice:'REC-002', amount:18500, due:_f(14), status:'Pending',  created_at:_dt(4) },
  { id:3, client:'Priya S',      invoice:'REC-003', amount:32000, due:_d(3),  status:'Overdue',  created_at:_dt(8) },
  { id:4, client:'Karthik V',    invoice:'REC-004', amount:14800, due:_f(5),  status:'Pending',  created_at:_dt(1) },
  { id:5, client:'Divya R',      invoice:'REC-005', amount:22400, due:_f(10), status:'Received', created_at:_dt(0) },
]

// Fabric Orders
export const initFabric = [
  { id:1, fabric:'Cotton Twill 240gsm', qty:'800 m',  supplier:'ABC Textiles',   order_date:_d(7),  delivery:_f(7),  amount:144000, status:'In Transit', created_at:_dt(7)  },
  { id:2, fabric:'Polyester Satin',     qty:'500 m',  supplier:'Fashion Hub',    order_date:_d(5),  delivery:_f(2),  amount:60000,  status:'Ordered',    created_at:_dt(5)  },
  { id:3, fabric:'Silk Organza',        qty:'200 m',  supplier:'Trend Fabrics',  order_date:_d(10), delivery:_f(5),  amount:130000, status:'Ordered',    created_at:_dt(10) },
  { id:4, fabric:'Denim 12oz',          qty:'600 m',  supplier:'Style Mills',    order_date:_d(15), delivery:_d(2),  amount:126000, status:'Delivered',  created_at:_dt(15) },
  { id:5, fabric:'Banarasi Brocade',    qty:'150 m',  supplier:'Elite Garments', order_date:_d(2),  delivery:_f(14), amount:180000, status:'Ordered',    created_at:_dt(2)  },
]

export const initTeam = [
  { id:1, name:'Rajesh Kumar', role:'CEO',       joined:'2020-01-15', status:'Active' },
  { id:2, name:'Priya Sharma', role:'Admin',     joined:'2021-03-10', status:'Active' },
  { id:3, name:'Amit Singh',   role:'Admin',     joined:'2022-06-01', status:'Active' },
  { id:4, name:'Sneha Patel',  role:'Marketing', joined:'2021-11-20', status:'Active' },
  { id:5, name:'Vikram Nair',  role:'Marketing', joined:'2023-02-14', status:'Active' },
  { id:6, name:'Deepa Rao',    role:'Marketing', joined:'2023-08-05', status:'Active' },
]

// ── MARKETING DATA ──────────────────────────────────────────────────────

// Google Ads (5 records)
export const initGoogleAds = [
  { id:1, campaign:'Summer Sale',      type:'Search',   budget:15000, spend:12000, clicks:3200, impressions:85000,  conversions:120, revenue:85000,  status:'Active', created_at:_dt(0,'09:00:00') },
  { id:2, campaign:'Festival Sale',    type:'Search',   budget:25000, spend:20000, clicks:6500, impressions:95000,  conversions:210, revenue:180000, status:'Active', created_at:_dt(2,'10:00:00') },
  { id:3, campaign:'New Arrivals',     type:'Display',  budget:12000, spend:10000, clicks:2800, impressions:62000,  conversions:98,  revenue:62000,  status:'Active', created_at:_dt(4,'09:00:00') },
  { id:4, campaign:'Clearance Sale',   type:'Shopping', budget:10000, spend:8000,  clicks:2100, impressions:48000,  conversions:75,  revenue:48000,  status:'Paused', created_at:_dt(7,'10:00:00') },
  { id:5, campaign:'Brand Awareness',  type:'Display',  budget:18000, spend:15000, clicks:4200, impressions:75000,  conversions:110, revenue:75000,  status:'Active', created_at:_dt(5,'09:00:00') },
]

// Meta Ads (5 records)
export const initMetaAds = [
  { id:1, campaign:'Facebook Sale Campaign',   type:'Feed',     budget:18000, spend:15000, reach:62000, impressions:88000,  conversions:150, revenue:110000, status:'Active', created_at:_dt(0,'09:30:00') },
  { id:2, campaign:'Instagram Fashion Ads',    type:'Stories',  budget:22000, spend:18000, reach:75000, impressions:105000, conversions:190, revenue:150000, status:'Active', created_at:_dt(1,'10:00:00') },
  { id:3, campaign:'Reels Promotion',          type:'Reels',    budget:14000, spend:12000, reach:48000, impressions:68000,  conversions:120, revenue:92000,  status:'Active', created_at:_dt(3,'09:00:00') },
  { id:4, campaign:'Lead Generation Campaign', type:'Audience', budget:12000, spend:10000, reach:38000, impressions:55000,  conversions:90,  revenue:68000,  status:'Paused', created_at:_dt(5,'10:00:00') },
  { id:5, campaign:'Festival Collection Ads',  type:'Carousel', budget:26000, spend:22000, reach:88000, impressions:128000, conversions:250, revenue:210000, status:'Active', created_at:_dt(2,'11:00:00') },
]

// Communication Ads: 5 WhatsApp + 5 Email + 5 SMS
export const initCommunicationAds = [
  // WhatsApp Revenue (5)
  { id:1,  campaign:'Festival Offer Alert',   type:'WhatsApp', budget:8000,  spend:5500, reach:10000, conversions:410, revenue:123000, status:'Active',    created_at:_dt(0,'08:00:00') },
  { id:2,  campaign:'Eid Collection Blast',   type:'WhatsApp', budget:10000, spend:7500, reach:12000, conversions:320, revenue:96000,  status:'Completed', created_at:_dt(1,'09:00:00') },
  { id:3,  campaign:'Flash Sale Broadcast',   type:'WhatsApp', budget:6000,  spend:4800, reach:8500,  conversions:285, revenue:85500,  status:'Active',    created_at:_dt(3,'10:00:00') },
  { id:4,  campaign:'New Product Launch',     type:'WhatsApp', budget:9000,  spend:7000, reach:14000, conversions:350, revenue:105000, status:'Active',    created_at:_dt(5,'09:00:00') },
  { id:5,  campaign:'Weekend Offer Campaign', type:'WhatsApp', budget:7000,  spend:5200, reach:9000,  conversions:260, revenue:78000,  status:'Completed', created_at:_dt(7,'10:00:00') },

  // Email Campaigns (5)
  { id:6,  campaign:'Summer Collection Mail', type:'Email', budget:5000, spend:3500, reach:11200, conversions:142, revenue:42600, status:'Completed', created_at:_dt(0,'10:00:00') },
  { id:7,  campaign:'Winter Collection Mail', type:'Email', budget:4500, spend:3000, reach:9800,  conversions:125, revenue:37500, status:'Completed', created_at:_dt(2,'09:00:00') },
  { id:8,  campaign:'New Arrivals Mail',      type:'Email', budget:6000, spend:4200, reach:15000, conversions:220, revenue:66000, status:'Active',    created_at:_dt(4,'10:00:00') },
  { id:9,  campaign:'Festival Mail',          type:'Email', budget:8000, spend:6000, reach:18500, conversions:310, revenue:93000, status:'Completed', created_at:_dt(6,'09:00:00') },
  { id:10, campaign:'Clearance Sale Mail',    type:'Email', budget:4000, spend:2800, reach:10500, conversions:185, revenue:55500, status:'Active',    created_at:_dt(8,'10:00:00') },

  // SMS Campaigns (5)
  { id:11, campaign:'New Arrivals SMS',   type:'SMS', budget:5000, spend:4200, reach:18000, conversions:180, revenue:54000,  status:'Active',    created_at:_dt(1,'09:00:00') },
  { id:12, campaign:'Flash Offer SMS',    type:'SMS', budget:4500, spend:3800, reach:15500, conversions:160, revenue:48000,  status:'Active',    created_at:_dt(3,'10:00:00') },
  { id:13, campaign:'Weekend Sale SMS',   type:'SMS', budget:6000, spend:5200, reach:20000, conversions:240, revenue:72000,  status:'Completed', created_at:_dt(5,'09:00:00') },
  { id:14, campaign:'Festival SMS',       type:'SMS', budget:8000, spend:7000, reach:25000, conversions:373, revenue:112000, status:'Completed', created_at:_dt(7,'10:00:00') },
  { id:15, campaign:'VIP Customer SMS',   type:'SMS', budget:3000, spend:2400, reach:8500,  conversions:127, revenue:38000,  status:'Active',    created_at:_dt(9,'09:00:00') },
]

// Abandoned Carts (5 records)
export const initAbandonedCarts = [
  { id:1, customer:'Cart #101', product:'Bridal Silk Saree', cart_value:3500, status:'Pending',   recovery_channel:'WhatsApp', created_at:_dt(0,'09:00:00') },
  { id:2, customer:'Cart #102', product:'Cotton Kurta Set',  cart_value:2200, status:'Recovered', recovery_channel:'Email',    created_at:_dt(1,'10:00:00') },
  { id:3, customer:'Cart #103', product:'Linen Pants',       cart_value:5100, status:'Pending',   recovery_channel:'WhatsApp', created_at:_dt(2,'09:00:00') },
  { id:4, customer:'Cart #104', product:'Denim Jacket',      cart_value:1800, status:'Recovered', recovery_channel:'SMS',      created_at:_dt(3,'10:00:00') },
  { id:5, customer:'Cart #105', product:'Party Wear',        cart_value:4300, status:'Pending',   recovery_channel:'WhatsApp', created_at:_dt(4,'09:00:00') },
]

// ── CEO DATA ─────────────────────────────────────────────────────────────
export const ceoStats = [
  { label:'Net Revenue',  value:'₹38.4L', change:'15.2% YoY', up:true  },
  { label:'Bank Balance', value:'₹19.1L', change:'Healthy',    up:true  },
  { label:'Ads ROAS',     value:'4.2×',   change:'Improving',  up:true  },
  { label:'Investment',   value:'₹52L',   change:'9.4% return',up:true  },
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
    { key:'date',    label:'Date',       type:'date'   },
    { key:'client',  label:'Client',     type:'search-select', options:['Sanjay Kumar', 'Arjun Raj', 'Priya S', 'Karthik V', 'Divya R', 'Shobitam', 'Taamara Silks', 'Other Clients'] },
    { key:'product', label:'Product',    type:'search-select', options:['Bridal Silk Saree', 'Cotton Kurta Set', 'Linen Pants', 'Denim Jacket', 'Party Wear', 'Kuurtis', 'Half Sarees', 'Other Products'] },
    { key:'qty',     label:'Quantity',   type:'number', placeholder:'e.g. 10' },
    { key:'amount',  label:'Amount (₹)', type:'number', placeholder:'e.g. 12500' },
    { key:'status',  label:'Status',     type:'select', options:['Pending','Completed','Overdue'] },
  ],
  inventory: [
    { key:'name',           label:'Item Name',          type:'text',   placeholder:'e.g. Cotton Shirt' },
    { key:'sku',            label:'SKU Code',            type:'text',   placeholder:'e.g. EK-CS-001' },
    { key:'barcode',        label:'Barcode',             type:'text',   placeholder:'e.g. 8901234...' },
    { key:'category',       label:'Category',            type:'text',   placeholder:'e.g. Cotton' },
    { key:'purchase_price', label:'Purchase Price (₹)',  type:'number', placeholder:'e.g. 250' },
    { key:'selling_price',  label:'Selling Price (₹)',   type:'number', placeholder:'e.g. 650' },
    { key:'warehouse_loc',  label:'Warehouse Location',  type:'text',   placeholder:'e.g. Aisle 4, Shelf B' },
    { key:'units',          label:'Units',               type:'number', placeholder:'e.g. 150' },
    { key:'unit',           label:'Unit Type',           type:'text',   placeholder:'e.g. pcs' },
    { key:'reorder_level',  label:'Reorder Level',       type:'number', placeholder:'e.g. 50' },
    { key:'supplier_name',  label:'Supplier Name',       type:'text',   placeholder:'e.g. ABC Textiles' },
    { key:'contact_num',    label:'Contact Number',      type:'text',   placeholder:'e.g. +91...' },
    { key:'supplier_email', label:'Supplier Email',      type:'email',  placeholder:'e.g. info@supplier.com' },
    { key:'address',        label:'Address',             type:'text',   placeholder:'Supplier address' },
    { key:'stock_status',   label:'Stock Status',        type:'select', options:['In Stock','Low Stock','Critical','Out of Stock'] },
  ],
  supplier_payments: [
    { key:'supplier',            label:'Supplier',             type:'text',   placeholder:'Supplier name' },
    { key:'invoice',             label:'Invoice No.',          type:'text',   placeholder:'e.g. INV-001' },
    { key:'invoice_date',        label:'Invoice Date',         type:'date'   },
    { key:'paid_date',           label:'Paid Date',            type:'date'   },
    { key:'transaction_date',    label:'Transaction Date',     type:'date'   },
    { key:'transaction_details', label:'Transaction Details',  type:'text',   placeholder:'Reference / UTR Number' },
    { key:'total_amount',        label:'Total Amount (₹)',     type:'number', placeholder:'e.g. 120000' },
    { key:'paid_amount',         label:'Paid Amount (₹)',      type:'number', placeholder:'e.g. 0' },
    { key:'pending_amount',      label:'Pending Amount (₹)',   type:'number', placeholder:'e.g. 120000' },
    { key:'due',                 label:'Due Date',             type:'date'   },
    { key:'payment_method',      label:'Payment Method',       type:'select', options:['Bank Transfer', 'UPI', 'Cheque', 'Cash'] },
    { key:'status',              label:'Payment Status',       type:'select', options:['Pending','Paid','Overdue'] },
  ],
  receivables: [
    { key:'client',  label:'Client',     type:'text',   placeholder:'Client name' },
    { key:'invoice', label:'Invoice No.', type:'text',  placeholder:'e.g. REC-001' },
    { key:'amount',  label:'Amount (₹)', type:'number', placeholder:'e.g. 25000' },
    { key:'due',     label:'Due Date',   type:'date'   },
    { key:'status',  label:'Status',     type:'select', options:['Pending','Received','Overdue'] },
  ],
  fabric_orders: [
    { key:'fabric',     label:'Fabric Name',   type:'text',   placeholder:'e.g. Cotton Twill' },
    { key:'qty',        label:'Quantity',       type:'text',   placeholder:'e.g. 500 m' },
    { key:'supplier',   label:'Supplier',       type:'text',   placeholder:'Supplier name' },
    { key:'order_date', label:'Order Date',     type:'date'   },
    { key:'delivery',   label:'Delivery Date',  type:'date'   },
    { key:'amount',     label:'Amount (₹)',     type:'number', placeholder:'e.g. 90000' },
    { key:'status',     label:'Status',         type:'select', options:['Ordered','In Transit','Delivered','Cancelled'] },
  ],
  google_ads: [
    { key:'campaign',    label:'Campaign Name', type:'text',   placeholder:'e.g. Summer Sale' },
    { key:'type',        label:'Type',          type:'select', options:['Search','Display','Shopping','Video'] },
    { key:'budget',      label:'Budget (₹)',    type:'number', placeholder:'e.g. 15000' },
    { key:'spend',       label:'Spend (₹)',     type:'number', placeholder:'e.g. 12000' },
    { key:'clicks',      label:'Clicks',        type:'number', placeholder:'e.g. 3000' },
    { key:'conversions', label:'Conversions',   type:'number', placeholder:'e.g. 100' },
    { key:'revenue',     label:'Revenue (₹)',   type:'number', placeholder:'e.g. 85000' },
    { key:'status',      label:'Status',        type:'select', options:['Active','Paused','Ended'] },
  ],
  meta_ads: [
    { key:'campaign',    label:'Campaign Name', type:'text',   placeholder:'e.g. Facebook Feed' },
    { key:'type',        label:'Type',          type:'select', options:['Feed','Stories','Reels','Audience','Carousel'] },
    { key:'budget',      label:'Budget (₹)',    type:'number', placeholder:'e.g. 18000' },
    { key:'spend',       label:'Spend (₹)',     type:'number', placeholder:'e.g. 15000' },
    { key:'reach',       label:'Reach',         type:'number', placeholder:'e.g. 60000' },
    { key:'conversions', label:'Conversions',   type:'number', placeholder:'e.g. 150' },
    { key:'revenue',     label:'Revenue (₹)',   type:'number', placeholder:'e.g. 110000' },
    { key:'status',      label:'Status',        type:'select', options:['Active','Paused','Ended'] },
  ],
  communication_ads: [
    { key:'campaign',    label:'Campaign Name', type:'text',   placeholder:'e.g. Festival Offer Alert' },
    { key:'type',        label:'Type',          type:'select', options:['WhatsApp','SMS','Email','Direct'] },
    { key:'budget',      label:'Budget (₹)',    type:'number', placeholder:'e.g. 8000' },
    { key:'spend',       label:'Spend (₹)',     type:'number', placeholder:'e.g. 5500' },
    { key:'reach',       label:'Reach',         type:'number', placeholder:'e.g. 10000' },
    { key:'conversions', label:'Conversions',   type:'number', placeholder:'e.g. 300' },
    { key:'revenue',     label:'Revenue (₹)',   type:'number', placeholder:'e.g. 90000' },
    { key:'status',      label:'Status',        type:'select', options:['Active','Completed','Paused','Ended'] },
  ],
  investments: [
    { key:'name', label:'Investment Name', type:'text', placeholder:'e.g. Equity Holdings' },
    { key:'type', label:'Investment Type', type:'text', placeholder:'e.g. Capex · Q3 2026' },
    { key:'val',  label:'Current Value',   type:'text', placeholder:'e.g. ₹80L' },
    { key:'note', label:'Performance Note',type:'text', placeholder:'e.g. ↑ 22.4% projected ROI' },
    { key:'up',   label:'Trending Up',     type:'select', options:['Yes', 'No', 'Neutral'] },
  ],
  users: [
    { key:'name',     label:'Full Name', type:'text',     placeholder:'e.g. Rajesh Arora' },
    { key:'username', label:'Username',  type:'text',     placeholder:'e.g. rajesh.arora' },
    { key:'password', label:'Password',  type:'password', placeholder:'Min 6 characters' },
    { key:'role',     label:'Role',      type:'select',   options:['Admin','Marketing'] },
  ],
  strategic_decisions: [
    { key:'title', label:'Decision Title',   type:'text', placeholder:'e.g. Scale Meta Ads spend' },
    { key:'body',  label:'Decision Details', type:'text', placeholder:'Describe the decision...' },
    { key:'dot',   label:'Priority Color',   type:'select', options:['#22c55e', '#f97316', '#3b82f6', '#a855f7'] },
  ],
  abandoned_carts: [
    { key:'customer',         label:'Customer / Cart ID', type:'text',   placeholder:'e.g. Cart #101'   },
    { key:'product',          label:'Product',            type:'text',   placeholder:'e.g. Silk Saree'  },
    { key:'cart_value',       label:'Cart Value (₹)',     type:'number', placeholder:'e.g. 3500'        },
    { key:'recovery_channel', label:'Recovery Channel',   type:'select', options:['WhatsApp','Email','SMS','Direct'] },
    { key:'status',           label:'Status',             type:'select', options:['Abandoned','Recovered','Pending'] },
  ],
}

// ── Extended chart data ───────────────────────────────────────────────────
export const monthlyRevenue = [
  { month:'Jan', revenue:1200000, target:1100000, lastYear:980000  },
  { month:'Feb', revenue:1480000, target:1300000, lastYear:1120000 },
  { month:'Mar', revenue:1620000, target:1500000, lastYear:1340000 },
  { month:'Apr', revenue:1750000, target:1600000, lastYear:1480000 },
  { month:'May', revenue:1840000, target:1700000, lastYear:1560000 },
]
