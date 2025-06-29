import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

// Simple in-memory storage for now (will be replaced with AsyncStorage once native module works)
let memoryStorage: { [key: string]: string } = {}

const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      // Try AsyncStorage first
      const AsyncStorage = require('@react-native-async-storage/async-storage').default
      return await AsyncStorage.getItem(key)
    } catch (error) {
      console.warn('AsyncStorage not available, using memory storage:', error)
      return memoryStorage[key] || null
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      // Try AsyncStorage first
      const AsyncStorage = require('@react-native-async-storage/async-storage').default
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.warn('AsyncStorage not available, using memory storage:', error)
      memoryStorage[key] = value
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      // Try AsyncStorage first
      const AsyncStorage = require('@react-native-async-storage/async-storage').default
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.warn('AsyncStorage not available, using memory storage:', error)
      delete memoryStorage[key]
    }
  },
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (newToken: string, userData: User) => {
    await storage.setItem('auth_token', newToken)
    await storage.setItem('user_data', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }

  const logout = async () => {
    await storage.removeItem('auth_token')
    await storage.removeItem('user_data')
    setToken(null)
    setUser(null)
  }

  const checkAuth = async () => {
    try {
      const storedToken = await storage.getItem('auth_token')
      const storedUser = await storage.getItem('user_data')

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
