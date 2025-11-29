'use client'

import { useState } from 'react'
import { authApi } from '@/lib/api'

export default function TestAuthPage() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await authApi.login({ 
        email: 'test@example.com', 
        password: 'test123' 
      })
      setResult({ success: true, data: response.data })
    } catch (error) {
      setResult({ 
        success: false, 
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
    }
    setLoading(false)
  }

  const testSignup = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await authApi.signup({ 
        email: `test${Date.now()}@example.com`, 
        password: 'test123',
        full_name: 'Test User',
        role: 'user'
      })
      setResult({ success: true, data: response.data })
    } catch (error) {
      setResult({ 
        success: false, 
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Auth API Test</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={testLogin}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Test Login
          </button>
          <button
            onClick={testSignup}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 ml-4"
          >
            Test Signup
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {result && (
          <div className={`p-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <h2 className="font-bold">{result.success ? 'Success' : 'Error'}</h2>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}


