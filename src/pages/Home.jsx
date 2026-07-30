import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Building2,
  GraduationCap,
  CalendarDays,
  Siren,
  ArrowRight,
  LayoutDashboard,
  ClipboardCheck
} from 'lucide-react'
import SearchBox from '../components/SearchBox'
import QuickActionCard from '../components/QuickActionCard'
import CampusMapView from '../components/CampusMapView'
import { useApp } from '../context/AppContext'

export default function Home() {
  const { role, buildings } = useApp()
  const navigate = useNavigate()

  const greetings = {
    student: 'Where do you need to be today?',
    professor: 'Manage your availability and find your way around.',
    visitor: "Let's get you where you need to go.",
    staff: 'Assist a visitor or check facility status.',
    admin: 'Oversee campus activity at a glance.',
    controller: 'Manage exam rooms and building access.'
  }

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm font-medium text-amber-500">Hello{role ? `, ${role}` : ''} 👋</p>
        <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">
          {greetings[role] || 'Find anyone, find anywhere — instantly.'}
        </h1>
      </motion.div>

      <div className="mb-8">
        <SearchBox autoFocus />
      </div>

      {role === 'professor' && (
        <button
          onClick={() => navigate('/professor-dashboard')}
          className="glass-card mb-6 flex w-full items-center gap-4 p-4 text-left hover:shadow-glow"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/15 text-teal-500">
            <LayoutDashboard size={22} />
          </span>
          <span className="flex-1">
            <span className="block font-display font-semibold">Open your Availability Dashboard</span>
            <span className="block text-sm text-navy-500 dark:text-slate2-200/60">Update your status so students know when to visit</span>
          </span>
          <ArrowRight size={18} className="text-navy-400" />
        </button>
      )}

      {role === 'controller' && (
        <button
          onClick={() => navigate('/exam-controller')}
          className="glass-card mb-6 flex w-full items-center gap-4 p-4 text-left hover:shadow-glow"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/15 text-teal-500">
            <ClipboardCheck size={22} />
          </span>
          <span className="flex-1">
            <span className="block font-display font-semibold">Open Examination Controller Dashboard</span>
            <span className="block text-sm text-navy-500 dark:text-slate2-200/60">Manage rooms, seating and building access</span>
          </span>
          <ArrowRight size={18} className="text-navy-400" />
        </button>
      )}

      <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-navy-500 dark:text-slate2-200/50">
        Quick actions
      </p>
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <QuickActionCard icon={User} label="Find Professor" to="/search?q=professor" accent="amber" delay={0.05} />
        <QuickActionCard icon={Building2} label="Find Building" to="/map" accent="teal" delay={0.1} />
        <QuickActionCard icon={GraduationCap} label="My Exam Center" to="/exam-center" accent="amber" delay={0.15} />
        <QuickActionCard icon={CalendarDays} label="Today's Events" to="/events" accent="teal" delay={0.2} />
        <QuickActionCard icon={Siren} label="Emergency" to="/emergency" accent="coral" delay={0.25} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500 dark:text-slate2-200/50">
          Campus map preview
        </p>
        <button onClick={() => navigate('/map')} className="focus-ring flex items-center gap-1 text-sm font-semibold text-amber-500">
          Open full map <ArrowRight size={14} />
        </button>
      </div>
      <CampusMapView buildings={buildings} selectedId={null} onSelect={(id) => navigate(`/map?focus=${id}`)} height="h-72 md:h-80" />
    </div>
  )
}
