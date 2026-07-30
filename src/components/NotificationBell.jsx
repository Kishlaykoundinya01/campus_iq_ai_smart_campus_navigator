import React, { useState, useRef, useEffect } from 'react'
import { Bell, GraduationCap, Building2, Route, CalendarDays, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

const ICONS = {
  professor: User,
  exam: GraduationCap,
  building: Building2,
  route: Route,
  event: CalendarDays
}

export default function NotificationBell() {
  const { notifications, unreadCount, markNotificationRead, markAllRead } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-700 hover:bg-amber-500/20 dark:bg-white/10 dark:text-slate2-100"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="glass-card absolute right-0 z-40 mt-2 max-h-96 w-80 overflow-y-auto p-2"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <p className="font-display font-semibold">Notifications</p>
              <button onClick={markAllRead} className="focus-ring text-xs font-semibold text-amber-500 hover:underline">
                Mark all read
              </button>
            </div>
            {notifications.length === 0 && <p className="px-3 py-6 text-center text-sm text-navy-500">You're all caught up.</p>}
            {notifications.map((n) => {
              const Icon = ICONS[n.type] || Bell
              return (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`focus-ring flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-amber-500/10 ${
                    !n.read ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-600 dark:bg-white/10 dark:text-slate2-100">
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{n.title}</span>
                    <span className="block truncate text-xs text-navy-500 dark:text-slate2-200/60">{n.message}</span>
                    <span className="block text-[11px] text-navy-400 dark:text-slate2-200/40">{n.time}</span>
                  </span>
                  {!n.read && <span className="ml-auto mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
