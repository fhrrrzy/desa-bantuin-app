import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'

interface User {
  id: number
  name: string
  email: string
  phone_number: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string, user: User) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token'
const USER_DATA_KEY = 'user_data'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (newToken: string, userData: User) => {
    try {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, newToken)
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData))
      setToken(newToken)
      setUser(userData)
    } catch (error) {
      console.error('Error saving auth data:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY)
      await SecureStore.deleteItemAsync(USER_DATA_KEY)
      setToken(null)
      setUser(null)
    } catch (error) {
      console.error('Error clearing auth data:', error)
      throw error
    }
  }

  const checkAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY)
      const storedUser = await SecureStore.getItemAsync(USER_DATA_KEY)

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
