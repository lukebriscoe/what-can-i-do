import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { reducer } from './state/reducer.js'
import { loadState, saveState } from './state/store.js'
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

  // Persist on every change (after the initial hydrate).
  useEffect(() => {
    if (!ready) return
    if (firstLoad.current) {
      firstLoad.current = false
      return
    }
    saveState(state)
  }, [state, ready])

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
