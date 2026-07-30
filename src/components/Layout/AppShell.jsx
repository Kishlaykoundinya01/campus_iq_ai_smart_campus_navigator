import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Map as MapIcon,
  GraduationCap,
  Siren,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Compass
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import NotificationBell from '../NotificationBell'
import FloatingAssistant from '../FloatingAssistant'

const NAV_ITEMS = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/map', label: 'Map', icon: MapIcon },
  { to: '/exam-center', label: 'Exams', icon: GraduationCap },
  { to: '/emergency', label: 'Emergency', icon: Siren },
  { to: '/settings', label: 'Settings', icon: SettingsIcon }
]

export default function AppShell() {
  const { role, theme, toggleTheme } = useApp()
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-slate2-50 dark:bg-navy-950">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-navy-100 bg-white/60 px-4 py-6 backdrop-blur-xl dark:border-white/5 dark:bg-navy-900/50 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-navy-950">
            <Compass size={20} />
          </span>
          <span className="font-display text-lg font-bold">CampusIQ</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-500'
                    : 'text-navy-600 hover:bg-navy-100 dark:text-slate2-200/70 dark:hover:bg-white/5'
                }`
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        {role && (
          <div className="glass-card mt-4 px-4 py-3">
            <p className="text-xs text-navy-500 dark:text-slate2-200/50">Signed in as</p>
            <p className="font-display font-semibold capitalize">{role}</p>
          </div>
        )}
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-navy-100 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-white/5 dark:bg-navy-900/60 md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-navy-950">
              <Compass size={16} />
            </span>
            <span className="font-display font-bold">CampusIQ</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-700 hover:bg-amber-500/20 dark:bg-white/10 dark:text-slate2-100"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="glass fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-navy-100 px-2 py-2 dark:border-white/5 md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `focus-ring flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium ${
                isActive ? 'text-amber-500' : 'text-navy-500 dark:text-slate2-200/60'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <FloatingAssistant />
    </div>
  )
}
