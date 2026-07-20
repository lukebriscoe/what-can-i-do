import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { reducer } from './state/reducer.js'
import { loadState, saveState, flushState } from './state/store.js'
import { defaultState } from './state/defaults.js'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, defaultState)
  const [ready, setReady] = useState(false)
  const firstLoad = useRef(true)

  // Hydrate once from IndexedDB.
  useEffect(() => {
    let alive = true
    loadState().then((loaded) => {
      if (!alive) return
      dispatch({ type: 'hydrate', state: loaded })
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [])

  // Ask the browser to keep our data around. On iOS home-screen web apps this
  // helps stop the OS evicting IndexedDB when the app is closed (a cause of
  // "it reset overnight"). Best-effort; ignored where unsupported.
  useEffect(() => {
    navigator.storage?.persist?.().catch(() => {})
  }, [])

  // Persist on every change (after the initial hydrate).
  useEffect(() => {
    if (!ready) return
    if (firstLoad.current) {
      firstLoad.current = false
      return
    }
    saveState(state)
  }, [state, ready])

  // Keep the latest state available to the flush-on-exit handler.
  const latest = useRef(state)
  useEffect(() => {
    latest.current = state
  }, [state])

  // Flush immediately when the app is backgrounded or closed, so the last
  // change can't be lost to the debounce window. visibilitychange('hidden')
  // is the reliable signal on mobile; pagehide covers tab close / bfcache.
  useEffect(() => {
    if (!ready) return
    const flushIfHidden = () => {
      if (document.visibilityState === 'hidden') flushState(latest.current)
    }
    const flush = () => flushState(latest.current)
    document.addEventListener('visibilitychange', flushIfHidden)
    window.addEventListener('pagehide', flush)
    return () => {
      document.removeEventListener('visibilitychange', flushIfHidden)
      window.removeEventListener('pagehide', flush)
    }
  }, [ready])

  return (
    <StoreContext.Provider value={{ state, dispatch, ready }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
