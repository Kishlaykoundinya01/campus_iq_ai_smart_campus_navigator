import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Languages, Moon, Sun, Eye, Type, LogOut } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { language, setLanguage, theme, toggleTheme, accessibilityMode, setAccessibilityMode, largeText, setLargeText, role, resetRole } = useApp()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Settings" subtitle="Make CampusIQ work the way you need" />

      <div className="space-y-4">
        <SettingCard icon={Languages} title="Language" description="Choose your preferred language">
          <div className="flex gap-2">
            {['en', 'hi'].map((code) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`focus-ring rounded-xl px-4 py-2 text-sm font-semibold ${
                  language === code ? 'bg-amber-500 text-navy-950' : 'bg-navy-100 text-navy-700 dark:bg-white/10 dark:text-slate2-100'
                }`}
              >
                {code === 'en' ? 'English' : 'हिन्दी'}
              </button>
            ))}
          </div>
        </SettingCard>

        <SettingCard icon={theme === 'dark' ? Moon : Sun} title="Dark mode" description="Easier on the eyes at night">
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </SettingCard>

        <SettingCard icon={Eye} title="Accessibility mode" description="Higher contrast, simpler layout">
          <Toggle checked={accessibilityMode} onChange={() => setAccessibilityMode((v) => !v)} />
        </SettingCard>

        <SettingCard icon={Type} title="Large text mode" description="Bigger text across the app">
          <Toggle checked={largeText} onChange={() => setLargeText((v) => !v)} />
        </SettingCard>

        {role && (
          <SettingCard icon={LogOut} title="Switch role" description={`Currently: ${role}`}>
            <button
              onClick={() => {
                resetRole()
                navigate('/select-role')
              }}
              className="btn-secondary !px-4 !py-2 text-sm"
            >
              Change
            </button>
          </SettingCard>
        )}
      </div>
    </div>
  )
}

function SettingCard({ icon: Icon, title, description, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex items-center gap-4 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-600 dark:bg-white/10 dark:text-slate2-100">
        <Icon size={19} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display font-semibold">{title}</p>
        <p className="text-sm text-navy-500 dark:text-slate2-200/60">{description}</p>
      </div>
      {children}
    </motion.div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`focus-ring relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-navy-200 dark:bg-white/15'}`}
    >
      <motion.span
        layout
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        animate={{ left: checked ? 26 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}
