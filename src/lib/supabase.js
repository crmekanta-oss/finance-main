import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('[Supabase] Init:', SUPABASE_URL)

export const isConfigured = SUPABASE_URL && 
                    SUPABASE_ANON_KEY && 
                    SUPABASE_URL !== 'your-project-url.supabase.co' && 
                    SUPABASE_ANON_KEY !== 'your-anon-key';

if (!isConfigured) {
  console.warn('Supabase is not correctly configured. Please check your .env file.');
}

export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'https://placeholder-url.supabase.co',
  isConfigured ? SUPABASE_ANON_KEY : 'placeholder-key',
  {
    auth: { persistSession: true },
    global: { fetch: (...args) => fetch(...args).catch(err => {
      console.error('[Supabase Fetch Error]:', err.message, 'URL:', args[0]);
      // Silently handle fetch errors (like DNS resolution issues)
      // and let the caller handle the missing data
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    })}
  }
)

// ── AUTH HELPERS ─────────────────────────────────────────
export async function signUpTeamMember(email, password, metadata) {
  try {
    console.log('[Supabase Auth] Attempting sign up for:', email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) {
      console.error('[Supabase Auth] Sign up error details:', error)
      throw error
    }
    console.log('[Supabase Auth] Sign up success for:', data.user?.id)
    return data
  } catch (err) {
    console.error('Sign up error:', err.message)
    throw err
  }
}

export async function signIn(email, password) {
  try {
    console.log('[Supabase Auth] Attempting sign in for:', email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      console.error('[Supabase Auth] Sign in error details:', error)
      throw error
    }
    console.log('[Supabase Auth] Sign in success for:', data.user?.id)
    return data
  } catch (err) {
    console.error('Sign in error:', err.message)
    throw err
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (err) {
    console.error('Sign out error:', err.message)
    throw err
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      if (error.message.includes('Auth session missing')) {
        console.log('[Auth] No active session found.');
        return null;
      }
      throw error;
    }
    return user
  } catch (err) {
    // Silently return null for expected "no session" states
    return null
  }
}

export async function getUserProfile(userId) {
  try {
    let { data, error } = await supabase
      .from('users')
      .select('role, status, username')
      .eq('id', userId)
      .maybeSingle()
    
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error fetching user profile:', err.message)
    return null
  }
}

// ── GENERIC CRUD HELPERS ─────────────────────────────────
export async function fetchAll(table) {
  try {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.error(`Error fetching ${table}:`, err.message)
    throw err
  }
}

export async function insertRow(table, row) {
  try {
    const { data, error } = await supabase.from(table).insert([row]).select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error(`Error inserting into ${table}:`, err.message)
    throw err
  }
}

export async function updateRow(table, id, updates) {
  try {
    const { data, error } = await supabase.from(table).update(updates).eq('id', id).select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error(`Error updating ${table} (id:${id}):`, err.message)
    throw err
  }
}

export const deleteUser = async (id) => { 
  console.log("[Supabase] Attempting to delete user:", id)

  // 1. Check if user even exists before trying to delete
  const { data: existing, error: findError } = await supabase
    .from('users')
    .select('id, username')
    .eq('id', id)
    .maybeSingle();

  if (findError) throw findError
  if (!existing) throw new Error(`User with ID ${id} not found in database.`)

  // 2. Attempt deletion
  const { data, error } = await supabase 
    .from('users') 
    .delete() 
    .eq('id', id) 
    .select() 

  if (error) throw error 
  
  if (!data || data.length === 0) {
    throw new Error("Delete failed. This usually happens if you are trying to delete your own account or do not have CEO permissions.")
  }

  console.log("[Supabase] User profile deleted successfully from database:", id)
 
  return data 
}

export async function deleteRow(table, id) {
  if (table === 'users') return deleteUser(id);
  
  try {
    const { data, error } = await supabase.from(table).delete().eq('id', id).select()
    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error(`Delete failed for ${table}. Check RLS policies.`)
    }
    return data
  } catch (err) {
    console.error(`Error deleting from ${table} (id:${id}):`, err.message)
    throw err
  }
}
