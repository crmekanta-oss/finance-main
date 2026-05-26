import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fgiltvohttrhgkoiwcre.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaWx0dm9odHRyaGdrb2l3Y3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTg3OTEsImV4cCI6MjA5Mzk5NDc5MX0.HjIsQTqZU2moEdsUbQR2sB_0mIHPlHQnoJOkDbmO3mQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  console.log('Inserting test user...')
  const testUser = {
    name: 'Test Member',
    username: 'testmember',
    password: 'password123',
    role: 'Admin',
    status: 'Active'
  }
  const { data, error } = await supabase.from('users').insert([testUser]).select()
  if (error) {
    console.error('Error inserting user:', error)
  } else {
    console.log('Successfully inserted user:', data)
    
    // Clean up
    console.log('Cleaning up user...')
    const { error: delError } = await supabase.from('users').delete().eq('id', data[0].id)
    if (delError) {
      console.error('Error deleting user:', delError)
    } else {
      console.log('Cleaned up test user successfully.')
    }
  }
}

testInsert()
