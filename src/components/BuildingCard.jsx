import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Building2 } from 'lucide-react'
import { BuildingStatusBadge } from './StatusBadge'

export default function BuildingCard({ building, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Link
        to={`/map?focus=${building.id}`}
        className="focus-ring glass-card flex items-center gap-4 p-4 transition-shadow hover:shadow-glow"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/25 to-amber-500/10 text-teal-500">
          <Building2 size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold">{building.name}</p>
          <p className="truncate text-sm text-navy-500 dark:text-slate2-200/60">{building.category} • {building.workingHours}</p>
          <BuildingStatusBadge status={building.status} className="mt-1.5" />
        </div>
        <ChevronRight className="shrink-0 text-navy-400" size={20} />
      </Link>
    </motion.div>
  )
}
