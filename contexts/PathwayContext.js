'use client'

import { createContext, useContext, useState } from 'react'

const PathwayContext = createContext()

export function PathwayProvider({ children }) {
  const [pathwayResults, setPathwayResults] = useState(null)

  return (
    <PathwayContext.Provider value={{ pathwayResults, setPathwayResults }}>
      {children}
    </PathwayContext.Provider>
  )
}

export function usePathway() {
  const context = useContext(PathwayContext)
  if (!context) {
    throw new Error('usePathway must be used within a PathwayProvider')
  }
  return context
}


