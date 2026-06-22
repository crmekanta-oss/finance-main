import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fgiltvohttrhgkoiwcre.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaWx0dm9odHRyaGdrb2l3Y3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTg3OTEsImV4cCI6MjA5Mzk5NDc5MX0.HjIsQTqZU2moEdsUbQR2sB_0mIHPlHQnoJOkDbmO3mQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('Fetching users from public.users...')
  const { data: users, error } = await supabase.from('users').select('*')
  if (error) {
    console.error('Error fetching users:', error)
  } else {
    console.log('Users in public.users:', users)
  }
}

test()
