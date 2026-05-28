// ── ADMIN DATA ──────────────────────────────────────────────────────────
export const initSales = [
  // Today — 27 May 2026
  { id:1,  date:'2026-05-27', client:'Shobitam',          product:'Bridal Silk Saree',  qty:5,   amount:62500,  status:'Completed' },
  { id:2,  date:'2026-05-27', client:'Fashionista Ltd',   product:'Cotton Kurta Set',   qty:80,  amount:44000,  status:'Completed' },
  { id:3,  date:'2026-05-27', client:'Ethnic Trends',     product:'Half Sarees',        qty:40,  amount:28000,  status:'Pending'   },

  // Last 7 Days (21–26 May)
  { id:4,  date:'2026-05-26', client:'Urban Wear',         product:'Denim Jacket',      qty:60,  amount:68000,  status:'Completed' },
  { id:5,  date:'2026-05-26', client:'Style Hub',          product:'Polyester Shirt',   qty:200, amount:79000,  status:'Completed' },
  { id:6,  date:'2026-05-25', client:'Taamara Silks',      product:'Silk Saree',        qty:30,  amount:51000,  status:'Completed' },
  { id:7,  date:'2026-05-25', client:'Shobitam',           product:'Kuurtis',           qty:60,  amount:23200,  status:'Open'      },
  { id:8,  date:'2026-05-24', client:'Rajan Fabrics',      product:'Cotton Premium',    qty:120, amount:88000,  status:'Completed' },
  { id:9,  date:'2026-05-23', client:'Meena Exports',      product:'Silk Blend',        qty:80,  amount:34000,  status:'Pending'   },
  { id:10, date:'2026-05-22', client:'Fabric World',       product:'Linen Pants',       qty:80,  amount:63000,  status:'Pending'   },
  { id:11, date:'2026-05-21', client:'Trend Factory',      product:'Polyester Mix',     qty:200, amount:79000,  status:'Completed' },

  // Last 30 Days (27 Apr–20 May)
  { id:12, date:'2026-05-18', client:'Fashionista Ltd',    product:'Cotton Kurta',      qty:120, amount:42000,  status:'Completed' },
  { id:13, date:'2026-05-15', client:'Silk Collections',   product:'Banarasi Silk',     qty:20,  amount:74000,  status:'Completed' },
  { id:14, date:'2026-05-12', client:'Krishna Traders',    product:'Linen Pure',        qty:200, amount:54000,  status:'Completed' },
  { id:15, date:'2026-05-10', client:'Fashion Boutique',   product:'Party Wear',        qty:50,  amount:38500,  status:'Completed' },
  { id:16, date:'2026-05-07', client:'Priya Mills',        product:'Polyester Mix',     qty:300, amount:42000,  status:'Overdue'   },
  { id:17, date:'2026-05-03', client:'Arjun Clothiers',    product:'Cotton Premium',    qty:150, amount:48000,  status:'Completed' },
  { id:18, date:'2026-04-30', client:'Website Clients',    product:'Dress Collections', qty:25,  amount:31200,  status:'Completed' },
  { id:19, date:'2026-04-28', client:'Shobitam',           product:'Bridal Wear',       qty:8,   amount:96000,  status:'Completed' },

  // Older (before 27 Apr — visible only in 'All')
  { id:20, date:'2026-04-15', client:'Urban Wear',          product:'Denim Collection',  qty:100, amount:85000,  status:'Completed' },
  { id:21, date:'2026-04-08', client:'Ethnic Trends',       product:'Silk Saree',        qty:45,  amount:67500,  status:'Completed' },
  { id:22, date:'2026-03-25', client:'Fashionista Ltd',     product:'Linen Kurta',       qty:200, amount:58000,  status:'Completed' },
]

export const initInventory = [
  { id:1,  name:'Cotton Twill 240gsm',  category:'Cotton',    units:2400, unit:'metres', reorder_level:500, purchase_price:180,  selling_price:450,  stock_status:'In Stock',  sku:'EK-CT-001', supplier_name:'Raghav Textiles' },
  { id:2,  name:'Polyester Satin',       category:'Synthetic', units:980,  unit:'metres', reorder_level:300, purchase_price:120,  selling_price:320,  stock_status:'Low Stock', sku:'EK-PS-002', supplier_name:'SK Yarns'        },
  { id:3,  name:'Silk Organza',          category:'Silk',      units:460,  unit:'metres', reorder_level:200, purchase_price:650,  selling_price:1250, stock_status:'Low Stock', sku:'EK-SO-003', supplier_name:'Mitra Fabrics'    },
  { id:4,  name:'Denim Heavy 12oz',      category:'Denim',     units:1600, unit:'metres', reorder_level:400, purchase_price:210,  selling_price:580,  stock_status:'In Stock',  sku:'EK-DH-004', supplier_name:'Loom & Co'        },
  { id:5,  name:'Linen Natural',         category:'Linen',     units:120,  unit:'metres', reorder_level:300, purchase_price:290,  selling_price:720,  stock_status:'Critical',  sku:'EK-LN-005', supplier_name:'Weave Masters'    },
  { id:6,  name:'Wool Blend Fine',       category:'Wool',      units:800,  unit:'metres', reorder_level:200, purchase_price:480,  selling_price:1150, stock_status:'In Stock',  sku:'EK-WB-006', supplier_name:'Arjun Clothiers'  },
  { id:7,  name:'Banarasi Brocade',      category:'Silk',      units:280,  unit:'metres', reorder_level:150, purchase_price:1200, selling_price:2800, stock_status:'In Stock',  sku:'EK-BB-007', supplier_name:'Mitra Fabrics'    },
  { id:8,  name:'Chanderi Fabric',       category:'Cotton',    units:640,  unit:'metres', reorder_level:200, purchase_price:320,  selling_price:780,  stock_status:'In Stock',  sku:'EK-CF-008', supplier_name:'Raghav Textiles'  },
  { id:9,  name:'Georgette Crepe',       category:'Synthetic', units:350,  unit:'metres', reorder_level:200, purchase_price:180,  selling_price:420,  stock_status:'Low Stock', sku:'EK-GC-009', supplier_name:'SK Yarns'         },
  { id:10, name:'Pure Chiffon',          category:'Synthetic', units:0,    unit:'metres', reorder_level:250, purchase_price:145,  selling_price:380,  stock_status:'Out of Stock', sku:'EK-PC-010', supplier_name:'SK Yarns'      },
]

export const initPayments = [
  { id:1, supplier:'Raghav Textiles', invoice:'INV-001', total_amount:120000, paid_amount:120000, pending_amount:0,      invoice_date:'2026-05-01', due:'2026-05-10', status:'Paid',    payment_method:'Bank Transfer' },
  { id:2, supplier:'Mitra Fabrics',   invoice:'INV-002', total_amount:84500,  paid_amount:0,      pending_amount:84500,  invoice_date:'2026-05-10', due:'2026-05-20', status:'Pending', payment_method:'UPI'           },
  { id:3, supplier:'SK Yarns',        invoice:'INV-003', total_amount:230000, paid_amount:50000,  pending_amount:180000, invoice_date:'2026-04-15', due:'2026-04-30', status:'Overdue', payment_method:'Cheque'        },
  { id:4, supplier:'Loom & Co',       invoice:'INV-004', total_amount:67000,  paid_amount:67000,  pending_amount:0,      invoice_date:'2026-05-12', due:'2026-05-22', status:'Paid',    payment_method:'Bank Transfer' },
  { id:5, supplier:'Weave Masters',   invoice:'INV-005', total_amount:95000,  paid_amount:0,      pending_amount:95000,  invoice_date:'2026-05-18', due:'2026-05-28', status:'Pending', payment_method:'UPI'           },
  { id:6, supplier:'Arjun Clothiers', invoice:'INV-006', total_amount:54000,  paid_amount:54000,  pending_amount:0,      invoice_date:'2026-05-20', due:'2026-05-27', status:'Paid',    payment_method:'Bank Transfer' },
  { id:7, supplier:'Raghav Textiles', invoice:'INV-007', total_amount:148000, paid_amount:75000,  pending_amount:73000,  invoice_date:'2026-05-22', due:'2026-06-01', status:'Pending', payment_method:'Cheque'        },
  { id:8, supplier:'Mitra Fabrics',   invoice:'INV-008', total_amount:310000, paid_amount:310000, pending_amount:0,      invoice_date:'2026-04-05', due:'2026-04-20', status:'Paid',    payment_method:'Bank Transfer' },
]

export const initReceivables = [
  // Received
  { id:1,  client:'Fashionista Ltd',  invoice:'REC-001', amount:340000, due:'2026-05-08', status:'Received' },
  { id:2,  client:'Urban Wear',        invoice:'REC-002', amount:180000, due:'2026-05-05', status:'Received' },
  { id:7,  client:'Taamara Silks',     invoice:'REC-007', amount:96000,  due:'2026-05-15', status:'Received' },
  { id:8,  client:'Silk Collections',  invoice:'REC-008', amount:74000,  due:'2026-05-20', status:'Received' },

  // Pending / Overdue
  { id:3,  client:'Style Hub',         invoice:'REC-003', amount:90500,  due:'2026-04-28', status:'Overdue'  },
  { id:4,  client:'Trend Factory',     invoice:'REC-004', amount:125000, due:'2026-05-18', status:'Pending'  },
  { id:5,  client:'Fabric World',      invoice:'REC-005', amount:67500,  due:'2026-05-25', status:'Pending'  },
  { id:6,  client:'Shobitam',           invoice:'REC-006', amount:41200,  due:'2026-05-26', status:'Pending'  },
  { id:9,  client:'Krishna Traders',   invoice:'REC-009', amount:54000,  due:'2026-05-30', status:'Pending'  },
  { id:10, client:'Ethnic Trends',     invoice:'REC-010', amount:28000,  due:'2026-06-05', status:'Pending'  },
]

export const initFabric = [
  { id:1, fabric:'Cotton Twill 240gsm', qty:'800 m',  supplier:'Raghav Textiles', order_date:'2026-05-01', delivery:'2026-05-15', amount:144000, status:'In Transit' },
  { id:2, fabric:'Polyester Satin',      qty:'500 m',  supplier:'SK Yarns',        order_date:'2026-05-05', delivery:'2026-05-20', amount:60000,  status:'Delivered'  },
  { id:3, fabric:'Silk Organza',         qty:'200 m',  supplier:'Mitra Fabrics',   order_date:'2026-05-06', delivery:'2026-05-24', amount:130000, status:'Ordered'    },
  { id:4, fabric:'Denim 12oz',           qty:'600 m',  supplier:'Loom & Co',       order_date:'2026-04-28', delivery:'2026-05-10', amount:126000, status:'Delivered'  },
  { id:5, fabric:'Banarasi Brocade',     qty:'150 m',  supplier:'Mitra Fabrics',   order_date:'2026-05-20', delivery:'2026-06-05', amount:180000, status:'Ordered'    },
  { id:6, fabric:'Chanderi Fabric',      qty:'400 m',  supplier:'Raghav Textiles', order_date:'2026-05-22', delivery:'2026-06-08', amount:128000, status:'Ordered'    },
  { id:7, fabric:'Linen Natural',        qty:'300 m',  supplier:'Weave Masters',   order_date:'2026-05-15', delivery:'2026-05-28', amount:87000,  status:'In Transit' },
  { id:8, fabric:'Pure Chiffon',         qty:'250 m',  supplier:'SK Yarns',        order_date:'2026-04-20', delivery:'2026-05-05', amount:36250,  status:'Delivered'  },
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
// created_at dates spread across Today / 7 Days / 30 Days / Older
//   Today   = 2026-05-27
//   7 Days  = 2026-05-20 to 2026-05-27
//   30 Days = 2026-04-27 to 2026-05-27
//   Older   = before 2026-04-27  (only visible in 'All')

export const initGoogleAds = [
  // ── Today ──
  { id:1,  campaign:'Brand Search',        type:'Search',   budget:35000, spend:35000, clicks:8200,  impressions:100000, conversions:120, revenue:456000, status:'Active', created_at:'2026-05-27T09:00:00.000Z' },
  { id:5,  campaign:'YouTube Ads',         type:'Video',    budget:28000, spend:24000, clicks:3200,  impressions:182000, conversions:68,  revenue:204000, status:'Active', created_at:'2026-05-27T10:30:00.000Z' },

  // ── Last 7 Days ──
  { id:2,  campaign:'Product Keywords',    type:'Search',   budget:50000, spend:45000, clicks:12400, impressions:203000, conversions:140, revenue:560000, status:'Active', created_at:'2026-05-22T10:00:00.000Z' },
  { id:6,  campaign:'Performance Max',     type:'Shopping', budget:40000, spend:36000, clicks:6800,  impressions:92000,  conversions:98,  revenue:294000, status:'Active', created_at:'2026-05-25T09:00:00.000Z' },
  { id:7,  campaign:'Competitor Keywords', type:'Search',   budget:22000, spend:19500, clicks:4100,  impressions:58000,  conversions:55,  revenue:165000, status:'Active', created_at:'2026-05-23T11:00:00.000Z' },

  // ── Last 30 Days ──
  { id:3,  campaign:'Display Retarget',    type:'Display',  budget:30000, spend:25000, clicks:5800,  impressions:118000, conversions:54,  revenue:162000, status:'Paused', created_at:'2026-05-10T11:00:00.000Z' },
  { id:8,  campaign:'Dynamic Search Ads',  type:'Search',   budget:18000, spend:16200, clicks:3900,  impressions:72000,  conversions:42,  revenue:126000, status:'Active', created_at:'2026-05-15T08:00:00.000Z' },
  { id:9,  campaign:'Gmail Sponsored',     type:'Display',  budget:12000, spend:9800,  clicks:1200,  impressions:42000,  conversions:28,  revenue:84000,  status:'Paused', created_at:'2026-05-05T10:00:00.000Z' },

  // ── Older — Apr 2026 (All only) ──
  { id:4,  campaign:'Shopping Ads',        type:'Shopping', budget:20000, spend:15000, clicks:1600,  impressions:29000,  conversions:26,  revenue:70500,  status:'Active', created_at:'2026-04-20T08:00:00.000Z' },
  { id:10, campaign:'Discovery Campaign',  type:'Display',  budget:25000, spend:21000, clicks:4500,  impressions:95000,  conversions:38,  revenue:99750,  status:'Ended',  created_at:'2026-04-10T09:00:00.000Z' },

  // ── Historical — Dec 2025 to Mar 2026 (ROAS Trend chart source) ──
  { id:11, campaign:'Mar Keywords Plus',   type:'Search',   budget:43000, spend:41000, clicks:10800, impressions:185000, conversions:115, revenue:188600, status:'Ended',  created_at:'2026-03-22T09:00:00.000Z' },
  { id:12, campaign:'Feb Display Push',    type:'Display',  budget:24000, spend:22000, clicks:4800,  impressions:96000,  conversions:48,  revenue:96800,  status:'Ended',  created_at:'2026-02-18T09:00:00.000Z' },
  { id:13, campaign:'Jan Search Drive',    type:'Search',   budget:40000, spend:38000, clicks:9200,  impressions:168000, conversions:95,  revenue:155800, status:'Ended',  created_at:'2026-01-20T09:00:00.000Z' },
  { id:14, campaign:'Dec Brand Campaign',  type:'Search',   budget:32000, spend:30000, clicks:6800,  impressions:85000,  conversions:78,  revenue:114000, status:'Ended',  created_at:'2025-12-15T09:00:00.000Z' },
]

export const initMetaAds = [
  // ── Today ──
  { id:1,  campaign:'Facebook Feed',       type:'Feed',     budget:35000, spend:30000, reach:120000, impressions:180000, conversions:110, revenue:330000, status:'Active', created_at:'2026-05-27T09:30:00.000Z' },
  { id:5,  campaign:'Carousel Showcase',   type:'Carousel', budget:25000, spend:22000, reach:85000,  impressions:120000, conversions:72,  revenue:216000, status:'Active', created_at:'2026-05-27T11:00:00.000Z' },

  // ── Last 7 Days ──
  { id:2,  campaign:'Instagram Stories',   type:'Stories',  budget:30000, spend:25000, reach:98000,  impressions:140000, conversions:85,  revenue:255000, status:'Active', created_at:'2026-05-24T10:00:00.000Z' },
  { id:6,  campaign:'Collection Ads',      type:'Carousel', budget:20000, spend:17500, reach:62000,  impressions:88000,  conversions:58,  revenue:174000, status:'Active', created_at:'2026-05-26T09:00:00.000Z' },
  { id:7,  campaign:'Reels Video Views',   type:'Reels',    budget:18000, spend:15000, reach:74000,  impressions:105000, conversions:44,  revenue:132000, status:'Active', created_at:'2026-05-22T10:00:00.000Z' },

  // ── Last 30 Days ──
  { id:3,  campaign:'Reels Boost',         type:'Reels',    budget:20000, spend:18000, reach:92000,  impressions:128000, conversions:62,  revenue:186000, status:'Active', created_at:'2026-05-08T11:00:00.000Z' },
  { id:8,  campaign:'Lead Generation',     type:'Audience', budget:15000, spend:12800, reach:40000,  impressions:62000,  conversions:48,  revenue:144000, status:'Active', created_at:'2026-05-12T09:00:00.000Z' },
  { id:9,  campaign:'Event Promotion',     type:'Feed',     budget:12000, spend:10500, reach:35000,  impressions:52000,  conversions:35,  revenue:105000, status:'Paused', created_at:'2026-05-03T10:00:00.000Z' },

  // ── Older — Apr 2026 (All only) ──
  { id:4,  campaign:'Lookalike Audience',  type:'Audience', budget:15000, spend:12000, reach:50000,  impressions:72000,  conversions:33,  revenue:42000,  status:'Paused', created_at:'2026-04-18T08:00:00.000Z' },
  { id:10, campaign:'Brand Awareness',     type:'Feed',     budget:22000, spend:18500, reach:95000,  impressions:140000, conversions:28,  revenue:64750,  status:'Ended',  created_at:'2026-04-12T09:00:00.000Z' },

  // ── Historical — Dec 2025 to Mar 2026 (ROAS Trend chart source) ──
  { id:11, campaign:'Mar Carousel Push',   type:'Carousel', budget:21000, spend:19800, reach:76000,  impressions:114000, conversions:58,  revenue:67320,  status:'Ended',  created_at:'2026-03-18T09:00:00.000Z' },
  { id:12, campaign:'Feb Reels Drive',     type:'Reels',    budget:17000, spend:15500, reach:68000,  impressions:96000,  conversions:42,  revenue:49600,  status:'Ended',  created_at:'2026-02-22T09:00:00.000Z' },
  { id:13, campaign:'Jan Stories Push',    type:'Stories',  budget:22000, spend:21000, reach:74000,  impressions:108000, conversions:55,  revenue:63000,  status:'Ended',  created_at:'2026-01-15T09:00:00.000Z' },
  { id:14, campaign:'Dec FB Awareness',    type:'Feed',     budget:26000, spend:24000, reach:88000,  impressions:132000, conversions:64,  revenue:67200,  status:'Ended',  created_at:'2025-12-10T09:00:00.000Z' },
]

export const initCommunicationAds = [
  // ── Today ──
  { id:1,  campaign:'Eid Collection Blast',   type:'WhatsApp', budget:10000, spend:7500,  reach:12000, conversions:320, revenue:96000,  status:'Completed', created_at:'2026-05-27T08:00:00.000Z' },
  { id:4,  campaign:'Festival Offer Alert',   type:'WhatsApp', budget:8000,  spend:5500,  reach:10000, conversions:410, revenue:123000, status:'Active',    created_at:'2026-05-27T11:00:00.000Z' },
  { id:5,  campaign:'Summer Collection Mail', type:'Email',    budget:5000,  spend:3500,  reach:11200, conversions:142, revenue:42600,  status:'Active',    created_at:'2026-05-27T10:00:00.000Z' },

  // ── Last 7 Days ──
  { id:2,  campaign:'New Arrivals SMS',       type:'SMS',      budget:5000,  spend:4200,  reach:18000, conversions:180, revenue:54000,  status:'Active',    created_at:'2026-05-23T09:00:00.000Z' },
  { id:6,  campaign:'Flash Sale Broadcast',   type:'WhatsApp', budget:6000,  spend:4800,  reach:8500,  conversions:285, revenue:85500,  status:'Active',    created_at:'2026-05-26T09:00:00.000Z' },
  { id:7,  campaign:'Welcome Email Series',   type:'Email',    budget:3500,  spend:2400,  reach:6800,  conversions:68,  revenue:20400,  status:'Active',    created_at:'2026-05-21T10:00:00.000Z' },

  // ── Last 30 Days ──
  { id:3,  campaign:'Monthly Newsletter',     type:'Email',    budget:4000,  spend:2800,  reach:9500,  conversions:95,  revenue:28500,  status:'Active',    created_at:'2026-05-14T10:00:00.000Z' },
  { id:8,  campaign:'Diwali Preview WA',      type:'WhatsApp', budget:9000,  spend:7200,  reach:15000, conversions:380, revenue:114000, status:'Completed', created_at:'2026-05-10T08:00:00.000Z' },
  { id:9,  campaign:'Product Launch Email',   type:'Email',    budget:4500,  spend:3200,  reach:12000, conversions:120, revenue:36000,  status:'Completed', created_at:'2026-05-02T09:00:00.000Z' },

  // ── Older (All only) ──
  { id:10, campaign:'Loyalty Program Email',  type:'Email',    budget:3000,  spend:2200,  reach:7500,  conversions:75,  revenue:22500,  status:'Ended',     created_at:'2026-04-15T10:00:00.000Z' },
  { id:11, campaign:'Ramadan Campaign WA',    type:'WhatsApp', budget:12000, spend:9500,  reach:20000, conversions:520, revenue:156000, status:'Ended',     created_at:'2026-04-05T08:00:00.000Z' },
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
