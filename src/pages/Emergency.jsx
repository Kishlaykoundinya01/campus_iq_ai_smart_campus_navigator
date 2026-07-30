import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { HeartPulse, ShieldAlert, DoorOpen, Siren, FlameKindling, Navigation, Phone } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useApp } from '../context/AppContext'

const EMERGENCY_ITEMS = [
  { icon: HeartPulse, label: 'Health Centre', buildingId: 'b5', phone: '108', accent: 'coral' },
  { icon: ShieldAlert, label: 'Security Office', buildingId: 'b6', phone: '100', accent: 'amber' },
  { icon: DoorOpen, label: 'Nearest Emergency Exit', buildingId: 'b6', phone: null, accent: 'teal' },
  { icon: Siren, label: 'Police Help', buildingId: 'b6', phone: '100', accent: 'coral' },
  { icon: FlameKindling, label: 'Fire Safety', buildingId: 'b6', phone: '101', accent: 'amber' }
]

const ACCENTS = {
  coral: 'bg-coral-500/15 text-coral-500',
  amber: 'bg-amber-500/15 text-amber-500',
  teal: 'bg-teal-400/15 text-teal-500'
}

export default function Emergency() {
  const navigate = useNavigate()
  const { buildings } = useApp()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Emergency" subtitle="Fast access to help — every second counts" />

      <div className="mb-6 rounded-2xl bg-coral-500/10 p-4 text-center text-sm font-semibold text-coral-500">
        In a life-threatening emergency, call 112 (India Emergency Number) immediately.
      </div>

      <div className="space-y-3">
        {EMERGENCY_ITEMS.map((item, i) => {
          const building = buildings.find((b) => b.id === item.buildingId)
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="glass-card flex items-center gap-4 p-4"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${ACCENTS[item.accent]}`}>
                <item.icon size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold">{item.label}</p>
                {building && <p className="truncate text-sm text-navy-500 dark:text-slate2-200/60">{building.name} • {building.workingHours}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                {item.phone && (
                  <a href={`tel:${item.phone}`} className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-700 hover:bg-teal-400/20 dark:bg-white/10 dark:text-slate2-100">
                    <Phone size={16} />
                  </a>
                )}
                <button
                  onClick={() => navigate(`/map?focus=${item.buildingId}`)}
                  className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-navy-950"
                >
                  <Navigation size={16} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
