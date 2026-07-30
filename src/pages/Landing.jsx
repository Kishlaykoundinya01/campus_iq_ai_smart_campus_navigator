import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, ArrowRight, MapPin, Users, GraduationCap } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Landing() {
  const navigate = useNavigate()
  const { role } = useApp()

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy-950 text-slate2-50">
      <div className="absolute inset-0 bg-grid-glow" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-amber-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-teal-400/20 blur-[100px]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-navy-950">
            <Compass size={20} />
          </span>
          <span className="font-display text-lg font-bold">CampusIQ</span>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 text-center md:px-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="chip mb-6 bg-white/10 text-amber-300"
        >
          <Compass size={13} /> AI Smart Campus Navigator
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl font-display text-4xl font-bold leading-[1.1] md:text-6xl"
        >
          Find Anyone.
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-teal-300 bg-clip-text text-transparent">
            Find Anywhere. Instantly.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg text-slate2-200/70"
        >
          One search box. No confusing menus. CampusIQ guides students, professors, parents
          and visitors to any person or place on campus — instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => navigate(role ? '/home' : '/select-role')}
            className="btn-primary text-base"
          >
            {role ? 'Continue to Dashboard' : 'Get Started'} <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/select-role')} className="btn-secondary !bg-white/5 !text-slate2-50 !border-white/10">
            Switch Role
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { icon: Users, label: 'Locate any professor in seconds' },
            { icon: MapPin, label: 'Live, color-coded campus map' },
            { icon: GraduationCap, label: 'Instant exam center lookup' }
          ].map((f) => (
            <div key={f.label} className="glass-card !bg-white/5 !border-white/10 flex flex-col items-center gap-3 p-5 text-sm">
              <f.icon className="text-amber-400" size={22} />
              <p className="text-slate2-200/80">{f.label}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
