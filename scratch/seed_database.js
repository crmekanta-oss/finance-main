import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fgiltvohttrhgkoiwcre.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaWx0dm9odHRyaGdrb2l3Y3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTg3OTEsImV4cCI6MjA5Mzk5NDc5MX0.HjIsQTqZU2moEdsUbQR2sB_0mIHPlHQnoJOkDbmO3mQ'

const supabase = createClient(supabaseUrl, supabaseKey)

// Copy of seed data from seedData.js
const seedSales = [
  { date:'2026-05-18', client:'Fashionista Ltd',  product:'Cotton Kurta',    qty:120, amount:42000,  status:'Completed' },
  { date:'2026-05-19', client:'Urban Wear',        product:'Denim Jacket',   qty:60,  amount:68000,  status:'Completed' },
  { date:'2026-05-20', client:'Style Hub',         product:'Silk Saree',     qty:30,  amount:51000,  status:'Pending'   },
  { date:'2026-05-21', client:'Trend Factory',     product:'Polyester Shirt',qty:200, amount:79000,  status:'Completed' },
  { date:'2026-05-22', client:'Fabric World',      product:'Linen Pants',    qty:80,  amount:63000,  status:'Pending'   },
  { date:'2026-05-23', client:'Rajan Fabrics',     product:'Cotton Premium', qty:120, amount:88000,  status:'Completed' },
  { date:'2026-05-24', client:'Meena Exports',     product:'Silk Blend',     qty:80,  amount:34000,  status:'Pending'   },
  { date:'2026-05-25', client:'Shobitam',          product:'Kuurtis',        qty:1,   amount:23200,  status:'Open'      },
  { date:'2026-05-25', client:'Shobitam',          product:'Half Sarees',    qty:1,   amount:18000,  status:'Completed' },
  { date:'2026-05-10', client:'Krishna Traders',   product:'Linen Pure',     qty:200, amount:54000,  status:'Completed' },
  { date:'2026-05-05', client:'Priya Mills',       product:'Polyester Mix',  qty:300, amount:42000,  status:'Overdue'   },
  { date:'2026-05-01', client:'Arjun Clothiers',   product:'Cotton Premium', qty:150, amount:48000,  status:'Completed' }
]

const seedInventory = [
  { name:'Cotton Twill 240gsm', category:'Cotton',    units:2400, unit:'metres', reorder_level:500, purchase_price:180, selling_price:450, stock_status:'In Stock', sku:'EK-CT-001', supplier_name:'Raghav Textiles' },
  { name:'Polyester Satin',      category:'Synthetic', units:980,  unit:'metres', reorder_level:300, purchase_price:120, selling_price:320, stock_status:'Low Stock', sku:'EK-PS-002', supplier_name:'SK Yarns' },
  { name:'Silk Organza',         category:'Silk',      units:460,  unit:'metres', reorder_level:200, purchase_price:650, selling_price:1250, stock_status:'Low Stock', sku:'EK-SO-003', supplier_name:'Mitra Fabrics' },
  { name:'Denim Heavy 12oz',     category:'Denim',     units:1600, unit:'metres', reorder_level:400, purchase_price:210, selling_price:580, stock_status:'In Stock', sku:'EK-DH-004', supplier_name:'Loom & Co' },
  { name:'Linen Natural',        category:'Linen',     units:120,  unit:'metres', reorder_level:300, purchase_price:290, selling_price:720, stock_status:'Critical', sku:'EK-LN-005', supplier_name:'Weave Masters' },
  { name:'Wool Blend Fine',      category:'Wool',      units:800,  unit:'metres', reorder_level:200, purchase_price:480, selling_price:1150, stock_status:'In Stock', sku:'EK-WB-006', supplier_name:'Arjun Clothiers' }
]

const seedPayments = [
  { supplier:'Raghav Textiles', invoice:'INV-001', total_amount:120000, paid_amount:120000, pending_amount:0, amount:120000, invoice_date:'2026-05-01', due:'2026-05-10', status:'Paid', payment_method:'Bank Transfer' },
  { supplier:'Mitra Fabrics',   invoice:'INV-002', total_amount:84500,  paid_amount:0,      pending_amount:84500,  amount:84500,  invoice_date:'2026-05-10', due:'2026-05-20', status:'Pending', payment_method:'UPI' },
  { supplier:'SK Yarns',        invoice:'INV-003', total_amount:230000, paid_amount:50000,  pending_amount:180000, amount:230000, invoice_date:'2026-04-15', due:'2026-04-30', status:'Overdue', payment_method:'Cheque' },
  { supplier:'Loom & Co',       invoice:'INV-004', total_amount:67000,  paid_amount:67000,  pending_amount:0,      amount:67000,  invoice_date:'2026-05-12', due:'2026-05-22', status:'Paid', payment_method:'Bank Transfer' },
  { supplier:'Weave Masters',   invoice:'INV-005', total_amount:95000,  paid_amount:0,      pending_amount:95000,  amount:95000,  invoice_date:'2026-05-18', due:'2026-05-28', status:'Pending', payment_method:'UPI' }
]

const seedReceivables = [
  { client:'Fashionista Ltd', invoice:'REC-001', amount:340000, due:'2026-05-08', status:'Received' },
  { client:'Urban Wear',       invoice:'REC-002', amount:180000, due:'2026-05-05', status:'Received' },
  { client:'Style Hub',        invoice:'REC-003', amount:90500,  due:'2026-04-28', status:'Overdue'  },
  { client:'Trend Factory',    invoice:'REC-004', amount:125000, due:'2026-05-18', status:'Pending'  },
  { client:'Fabric World',     invoice:'REC-005', amount:67500,  due:'2026-05-25', status:'Pending'  },
  { client:'Shobitam',          invoice:'REC-006', amount:41200,  due:'2026-05-26', status:'Pending'  }
]

const seedFabric = [
  { fabric:'Cotton Twill 240gsm', qty:'800 m',  supplier:'Raghav Textiles', order_date:'2026-05-01', delivery:'2026-05-15', amount:144000, status:'In Transit' },
  { fabric:'Polyester Satin',      qty:'500 m',  supplier:'SK Yarns',        order_date:'2026-05-05', delivery:'2026-05-20', amount:60000,  status:'Ordered'    },
  { fabric:'Silk Organza',         qty:'200 m',  supplier:'Mitra Fabrics',   order_date:'2026-05-06', delivery:'2026-05-24', amount:130000, status:'Ordered'    },
  { fabric:'Denim 12oz',           qty:'600 m',  supplier:'Loom & Co',       order_date:'2026-04-28', delivery:'2026-05-10', amount:126000, status:'Delivered'  }
]

const seedGoogleAds = [
  { campaign:'Brand Search',      type:'Search',  budget:35000, spend:35000, clicks:8200,  impressions:100000, conversions:120, revenue:456000, status:'Active' },
  { campaign:'Product Keywords',  type:'Search',  budget:50000, spend:45000, clicks:12400, impressions:203000, conversions:140, revenue:560000, status:'Active' },
  { campaign:'Display Retarget',  type:'Display', budget:30000, spend:25000, clicks:5800,  impressions:118000, conversions:54,  revenue:162000, status:'Paused' },
  { campaign:'Shopping Ads',      type:'Shopping',budget:20000, spend:15000, clicks:1600,  impressions:29000,  conversions:26,  revenue:78000,  status:'Active' }
]

const seedMetaAds = [
  { campaign:'Facebook Feed',      type:'Feed',     budget:35000, spend:30000, reach:120000, impressions:180000, conversions:110, revenue:330000, status:'Active' },
  { campaign:'Instagram Stories',  type:'Stories',  budget:30000, spend:25000, reach:98000,  impressions:140000, conversions:85,  revenue:255000, status:'Active' },
  { campaign:'Reels Boost',        type:'Reels',    budget:20000, spend:18000, reach:92000,  impressions:128000, conversions:62,  revenue:186000, status:'Active' },
  { campaign:'Lookalike Audience', type:'Audience', budget:15000, spend:12000, reach:50000,  impressions:72000,  conversions:33,  revenue:99000,  status:'Paused' }
]

const seedCommunicationAds = [
  { campaign:'Eid Collection Blast', type:'WhatsApp', budget:10000, spend:7500, reach:12000, conversions:320, revenue:96000, status:'Completed' },
  { campaign:'New Arrivals SMS',     type:'SMS',      budget:5000,  spend:4200, reach:18000, conversions:180, revenue:54000, status:'Active' },
  { campaign:'Monthly Newsletter',   type:'Email',    budget:4000,  spend:2800, reach:9500,  conversions:95,  revenue:28500, status:'Active' },
  { campaign:'Festival Offer Alert', type:'WhatsApp', budget:8000,  spend:5500, reach:10000, conversions:410, revenue:123000, status:'Active' }
]

const seedInvestments = [
  { name:'Equity Holdings', type:'Capex · Q3 2026', val:'₹28L', note:'↑ 22.4% projected ROI', up:'Yes' },
  { name:'Fixed Deposits',  type:'Capex · Q3 2026', val:'₹16L', note:'Stable return', up:'Neutral' },
  { name:'Working Capital', type:'Capex · Q3 2026', val:'₹8L',  note:'Operational capital', up:'No' }
]

const seedDecisions = [
  { dot:'#22c55e', title:'Increase fabric orders 20%',   body:'Silk Blend & Polyester below threshold. Reorder from Mitra and SK Yarns recommended to avoid stockout.', status:'Pending' },
  { dot:'#f97316', title:'Clear overdue receivables',    body:'₹4.3L overdue from 3 clients. Escalate Style Hub follow-up — 23 days past due date.', status:'Pending' },
  { dot:'#3b82f6', title:'Scale Meta Ads spend',         body:'Meta ROAS 4.9× is highest performer. Recommend budget increase of ₹40,000 for Instagram Reels.', status:'Pending' },
  { dot:'#a855f7', title:'Approve warehouse automation', body:'Capex for automated picking system. Vendor: GreyOrange. Projected 18-month payback period.', status:'Pending' }
]

const targets = [
  { name: 'sales_entries', data: seedSales },
  { name: 'inventory', data: seedInventory },
  { name: 'supplier_payments', data: seedPayments },
  { name: 'receivables', data: seedReceivables },
  { name: 'fabric_orders', data: seedFabric },
  { name: 'google_ads', data: seedGoogleAds },
  { name: 'meta_ads', data: seedMetaAds },
  { name: 'communication_ads', data: seedCommunicationAds },
  { name: 'investments', data: seedInvestments },
  { name: 'strategic_decisions', data: seedDecisions }
]

async function seed() {
  for (const target of targets) {
    console.log(`Checking table: ${target.name}...`)
    const { count, error: countErr } = await supabase
      .from(target.name)
      .select('*', { count: 'exact', head: true })
      
    if (countErr) {
      console.error(`Error checking count of ${target.name}:`, countErr.message)
      continue
    }
    
    if (count === 0) {
      console.log(`Table ${target.name} is empty. Seeding ${target.data.length} rows...`)
      const { data, error: insertErr } = await supabase.from(target.name).insert(target.data).select()
      if (insertErr) {
        console.error(`Error seeding ${target.name}:`, insertErr.message)
      } else {
        console.log(`Seeded ${target.name} successfully. Rows inserted:`, data.length)
      }
    } else {
      console.log(`Table ${target.name} already has ${count} rows. Skipping.`)
    }
  }
}

seed()
