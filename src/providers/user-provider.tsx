"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useGetMe } from '@/hooks/employee/use-get-me'
import { Employee } from '@/services/employee/get-me.service'

interface UserContextType {
  user: Employee | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const { data: user, isLoading, error, refetch } = useGetMe()

  const value: UserContextType = {
    user,
    isLoading,
    error,
    refetch,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}