import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  User,
  Users,
  HardHat,
  ShieldCheck,
  ClipboardList,
  Compass,
  ArrowRight
} from 'lucide-react'
import usersData from '../data/users.json'
import { useApp } from '../context/AppContext'

const ICONS = {
  student: GraduationCap,
  professor: User,
  visitor: Users,
  staff: HardHat,
  admin: ShieldCheck,
  controller: ClipboardList
}

export default function RoleSelect() {
  const navigate = useNavigate()
  const { setRole } = useApp()

  function chooseRole(id) {
    setRole(id)
    navigate('/home')
  }

  return (
    <div className="relative min-h-screen bg-navy-950 px-6 py-12 text-slate2-50 md:px-12">
      <div className="absolute inset-0 bg-grid-glow" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-10 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-navy-950">
            <Compass size={20} />
          </span>
          <span className="font-display text-lg font-bold">CampusIQ</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold md:text-4xl"
        >
          Who's navigating today?
        </motion.h1>
        <p className="mt-2 text-slate2-200/60">Pick a role to personalize your CampusIQ experience.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {usersData.map((u, i) => {
            const Icon = ICONS[u.id] || User
            return (
              <motion.button
                key={u.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => chooseRole(u.id)}
                className="focus-ring glass-card !bg-white/5 !border-white/10 flex items-center gap-4 p-5 text-left transition-shadow hover:shadow-glow"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
                  <Icon size={24} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-semibold">{u.label}</span>
                  <span className="block text-sm text-slate2-200/60">{u.description}</span>
                </span>
                <ArrowRight className="shrink-0 text-slate2-200/40" size={18} />
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
