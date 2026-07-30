import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import professorsData from '../data/professors.json'
import buildingsData from '../data/buildings.json'
import notificationsData from '../data/notifications.json'

const AppContext = createContext(null)

const STORAGE_KEY = 'campusiq_state_v1'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function AppProvider({ children }) {
  const persisted = loadPersisted()

  const [role, setRole] = useState(persisted.role || null)
  const [theme, setTheme] = useState(persisted.theme || 'dark')
  const [language, setLanguage] = useState(persisted.language || 'en')
  const [accessibilityMode, setAccessibilityMode] = useState(persisted.accessibilityMode || false)
  const [largeText, setLargeText] = useState(persisted.largeText || false)

  const [professors, setProfessors] = useState(persisted.professors || professorsData)
  const [buildings, setBuildings] = useState(persisted.buildings || buildingsData)
  const [notifications, setNotifications] = useState(persisted.notifications || notificationsData)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    document.body.classList.toggle('large-text', largeText)
  }, [largeText])

  useEffect(() => {
    const data = { role, theme, language, accessibilityMode, largeText, professors, buildings, notifications }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [role, theme, language, accessibilityMode, largeText, professors, buildings, notifications])

  const updateProfessorStatus = useCallback((id, patch) => {
    setProfessors((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type: 'professor',
        title: `${patch.name || 'A professor'} status updated`,
        message: patch.statusReason ? patch.statusReason : `Status changed to ${patch.status}`,
        time: 'Just now',
        read: false
      },
      ...prev
    ])
  }, [])

  const updateBuildingStatus = useCallback((id, patch) => {
    setBuildings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type: 'building',
        title: `Building status updated`,
        message: patch.statusReason ? patch.statusReason : `Status changed to ${patch.status}`,
        time: 'Just now',
        read: false
      },
      ...prev
    ])
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const resetRole = useCallback(() => setRole(null), [])

  const value = {
    role,
    setRole,
    resetRole,
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    language,
    setLanguage,
    accessibilityMode,
    setAccessibilityMode,
    largeText,
    setLargeText,
    professors,
    buildings,
    notifications,
    unreadCount,
    updateProfessorStatus,
    updateBuildingStatus,
    markNotificationRead,
    markAllRead
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
