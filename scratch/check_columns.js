import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fgiltvohttrhgkoiwcre.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaWx0dm9odHRyaGdrb2l3Y3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTg3OTEsImV4cCI6MjA5Mzk5NDc5MX0.HjIsQTqZU2moEdsUbQR2sB_0mIHPlHQnoJOkDbmO3mQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectColumns() {
  // We can select a row or check column metadata via supabase.rpc or a simple select
  // Since we want to know column names for tables that might be empty, we can check if we can query postgres tables.
  // Actually, supabase might block direct query to information_schema via standard from() because it's not in public schema.
  // But we can check by trying to insert a dummy row or using other methods.
  // Alternatively, let's write a query using a postgrest filter or just check if we can query an empty table.
  // When we query an empty table, the metadata (column names) is not returned in data, but we can see if we can trigger a column error
  // by inserting an invalid column. For example, insert({invalid_col: 1}) will throw an error listing the valid columns or saying the column does not exist.
  // Let's test a simple dummy insert on strategic_decisions, investments, supplier_payments, fabric_orders, google_ads, meta_ads, communication_ads.
  
  const tables = [
    { name: 'supplier_payments', dummy: { supplier: 'Test' } },
    { name: 'fabric_orders', dummy: { fabric: 'Test' } },
    { name: 'google_ads', dummy: { campaign: 'Test' } },
    { name: 'meta_ads', dummy: { campaign: 'Test' } },
    { name: 'communication_ads', dummy: { campaign: 'Test' } },
    { name: 'investments', dummy: { name: 'Test' } },
    { name: 'strategic_decisions', dummy: { title: 'Test' } },
  ]
  
  for (const t of tables) {
    console.log(`Checking table columns for ${t.name}...`)
    const { data, error } = await supabase.from(t.name).insert([t.dummy]).select()
    if (error) {
      console.error(`Error inserting in ${t.name}:`, error.message)
    } else {
      console.log(`Success in ${t.name}, inserted:`, data[0])
      // Delete the dummy row
      await supabase.from(t.name).delete().eq('id', data[0].id)
    }
  }
}

inspectColumns()
