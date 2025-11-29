'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored token on mount and validate it
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('auth_user')
        
        if (storedToken && storedUser) {
          try {
            console.log('AuthContext: Found stored JWT token in localStorage')
            // Set token and user immediately for faster UI
            setToken(storedToken)
            try {
              const parsedUser = JSON.parse(storedUser)
              setUser(parsedUser)
              console.log('AuthContext: Restored user from localStorage:', parsedUser.email)
            } catch (e) {
              console.error('Error parsing stored user:', e)
            }
            
            // Validate token by fetching current user (in background)
            // Only validate if we have a token set
            if (storedToken) {
              try {
                const response = await authApi.getMe()
                const userData = response.data
                
                // Token is valid, update user data
                setUser(userData)
                localStorage.setItem('auth_user', JSON.stringify(userData))
              } catch (error) {
                // Token is invalid, clear storage
                console.error('Token validation failed:', error)
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
                setToken(null)
                setUser(null)
              }
            }
          } catch (error) {
            console.error('Auth check error:', error)
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            setToken(null)
            setUser(null)
          }
        }
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Starting login for', email)
      const response = await authApi.login({ email, password })
      console.log('AuthContext: Login response received', response)
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server')
      }
      
      const { access_token, user: userData } = response.data
      
      if (!access_token || !userData) {
        throw new Error('Missing token or user data in response')
      }
      
      console.log('AuthContext: Storing token and user data')
      
      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('auth_token', access_token)
          localStorage.setItem('auth_user', JSON.stringify(userData))
          
          // Verify token was stored
          const storedToken = localStorage.getItem('auth_token')
          if (storedToken === access_token) {
            console.log('AuthContext: JWT token successfully stored in localStorage')
          } else {
            console.error('AuthContext: Failed to store token in localStorage')
          }
        } catch (error) {
          console.error('AuthContext: Error storing token in localStorage:', error)
          // If localStorage is full or unavailable, still set state
        }
      }
      
      // Token will be added automatically by axios interceptor
      
      setToken(access_token)
      setUser(userData)
      
      console.log('AuthContext: Login successful, user:', userData)
      return { success: true, user: userData }
    } catch (error) {
      console.error('AuthContext: Login error:', error)
      console.error('AuthContext: Error response:', error.response)
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Login failed'
      }
    }
  }

  const signup = async (email, password, fullName, role = 'user') => {
    try {
      console.log('AuthContext: Starting signup for', email)
      const response = await authApi.signup({ email, password, full_name: fullName, role })
      console.log('AuthContext: Signup response received', response)
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server')
      }
      
      const userData = response.data
      console.log('AuthContext: User created, attempting auto-login')
      
      // After signup, automatically login
      const loginResult = await login(email, password)
      if (loginResult.success) {
        console.log('AuthContext: Signup and auto-login successful')
        return { success: true, user: loginResult.user }
      }
      console.log('AuthContext: Signup successful but auto-login failed')
      return loginResult
    } catch (error) {
      console.error('AuthContext: Signup error:', error)
      console.error('AuthContext: Error response:', error.response)
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Signup failed'
      }
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    
    // Token removal is handled by localStorage cleanup
    
    setToken(null)
    setUser(null)
    router.push('/login')
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

