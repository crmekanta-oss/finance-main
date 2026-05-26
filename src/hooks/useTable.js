import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, isConfigured, deleteRow } from '../lib/supabase'

/**
 * Generic CRUD hook — works offline with seed data, syncs with Supabase when configured.
 */
export function useTable(tableName, initialData = []) {
  const [rows, setRows]       = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // Fetch from Supabase
  const refresh = useCallback(async () => {
    if (!isConfigured) return
    setLoading(true)
    try {
      const { data, error: dbErr } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
      if (dbErr) {
        console.warn(`[useTable] Fetch failed for ${tableName}:`, dbErr.message)
      } else {
        setRows(data || [])
      }
    } catch (err) {
      console.warn(`[useTable] Connection error for ${tableName}:`, err.message)
    } finally {
      setLoading(false)
    }
  }, [tableName])

  useEffect(() => {
    refresh()
    if (!isConfigured) return
    const channel = supabase
      .channel(`rt_${tableName}_${Math.random().toString(36).slice(2, 7)}`)
      .on('postgres_changes', { event:'*', schema:'public', table:tableName }, refresh)
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [refresh, tableName])

  // ADD
  const add = useCallback(async (row) => {
    if (!isConfigured) {
      const newRow = { ...row, id: Date.now(), created_at: new Date().toISOString() }
      setRows(prev => [newRow, ...prev])
      return newRow
    }
    try {
      const { data, error: dbErr } = await supabase
        .from(tableName).insert(row).select().single()
      if (dbErr) throw dbErr
      setRows(prev => [data, ...prev])
      return data
    } catch (e) {
      setError(e.message)
      alert(`Error adding record: ${e.message}`)
      return null
    }
  }, [tableName])

  // EDIT
  const edit = useCallback(async (id, updates) => {
    // Optimistic update
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
    if (!isConfigured) return
    try {
      const { data, error: dbErr } = await supabase
        .from(tableName).update(updates).eq('id', id).select().single()
      if (dbErr) throw dbErr
      setRows(prev => prev.map(r => r.id === id ? data : r))
    } catch (e) {
      setError(e.message)
      refresh() // revert
    }
  }, [tableName, refresh])

  // REMOVE
  const remove = useCallback(async (id) => {
    // Optimistic remove
    const previousRows = rows
    setRows(prev => prev.filter(r => r.id !== id))
    
    if (!isConfigured || typeof id === 'number') return
    
    try {
      await deleteRow(tableName, id)
    } catch (e) {
      console.error(`[useTable] Delete failed for ${tableName}:`, e.message)
      setError(e.message)
      alert(`Delete failed: ${e.message}`)
      setRows(previousRows) // revert to previous state
    }
  }, [tableName, rows, isConfigured])

  return useMemo(() => ({
    rows, setRows, loading, error, add, edit, remove, refresh,
  }), [rows, loading, error, add, edit, remove, refresh])
}
