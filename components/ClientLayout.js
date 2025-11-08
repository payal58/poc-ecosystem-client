'use client'

import { useTheme } from './ThemeProvider'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ClientLayout({ children }) {
  const { darkMode, toggleDarkMode } = useTheme()
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">
        {children}
      </main>
      <Footer darkMode={darkMode} />
    </div>
  )
}




