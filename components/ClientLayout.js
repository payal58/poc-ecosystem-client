'use client'

import { useTheme } from './ThemeProvider'
import { PathwayProvider } from '@/contexts/PathwayContext'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ClientLayout({ children }) {
  const { darkMode, toggleDarkMode } = useTheme()
  const pathname = usePathname()
  
  // Don't show navbar/footer on login/signup pages
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  
  return (
    <PathwayProvider>
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {!isAuthPage && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        <main className="flex-1">
          {children}
        </main>
        {!isAuthPage && <Footer darkMode={darkMode} />}
      </div>
    </PathwayProvider>
  )
}




