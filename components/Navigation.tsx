import { useState } from 'react'
import Link from 'next/link'
import { useStudy } from '@/contexts/StudyContext'
import { BookOpen, Home, BarChart3, Settings, Menu, X } from 'lucide-react'

export default function Navigation() {
  const { state } = useStudy()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/study', label: 'Study', icon: BookOpen },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-gray-900">NBHWC Study</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors cursor-pointer">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </span>
              </Link>
            ))}
            
            {/* User Stats */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
              <span className="text-sm text-gray-600">Level {state.user.level}</span>
              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
                {state.user.points} pts
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{state.user.streak}d</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span 
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </span>
                </Link>
              ))}
              
              {/* Mobile User Stats */}
              <div className="px-3 py-2 border-t border-gray-200 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Level {state.user.level}</span>
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                    {state.user.points} pts
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{state.user.streak} day streak</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
