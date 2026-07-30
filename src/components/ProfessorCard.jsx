import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { ProfessorStatusBadge } from './StatusBadge'

export default function ProfessorCard({ professor, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Link
        to={`/professor/${professor.id}`}
        className="focus-ring glass-card flex items-center gap-4 p-4 transition-shadow hover:shadow-glow"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-teal-400/20 font-display text-lg font-semibold text-navy-800 dark:text-slate2-50">
          {professor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold">{professor.name}</p>
          <p className="truncate text-sm text-navy-500 dark:text-slate2-200/60">{professor.department}</p>
          <ProfessorStatusBadge status={professor.status} className="mt-1.5" />
        </div>
        <ChevronRight className="shrink-0 text-navy-400" size={20} />
      </Link>
    </motion.div>
  )
}
