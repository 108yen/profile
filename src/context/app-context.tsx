"use client"

import { createContext, PropsWithChildren, useContext, useMemo } from "react"

export interface AppProviderProps
  extends PropsWithChildren<{ version?: string }> {}

export const AppContext = createContext<AppProviderProps>({})

export function AppProvider({ children, ...rest }: AppProviderProps) {
  const value = useMemo(() => ({ ...rest }), [rest])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
