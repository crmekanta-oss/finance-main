import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fgiltvohttrhgkoiwcre.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaWx0dm9odHRyaGdrb2l3Y3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTg3OTEsImV4cCI6MjA5Mzk5NDc5MX0.HjIsQTqZU2moEdsUbQR2sB_0mIHPlHQnoJOkDbmO3mQ'

const supabase = createClient(supabaseUrl, supabaseKey)

const tables = [
  'sales_entries',
  'inventory',
  'supplier_payments',
  'receivables',
  'fabric_orders',
  'google_ads',
  'meta_ads',
  'communication_ads',
  'investments',
  'strategic_decisions',
  'users'
]

async function inspectAll() {
  for (const t of tables) {
    console.log(`Checking table: ${t}...`)
    const { data, error } = await supabase.from(t).select('*').limit(1)
    if (error) {
      console.error(`Error for ${t}:`, error.message)
    } else {
      console.log(`Row in ${t}:`, data[0] || 'EMPTY')
    }
  }
}

inspectAll()
