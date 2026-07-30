import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function QuickActionCard({ icon: Icon, label, to, accent = 'amber', delay = 0 }) {
  const accents = {
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-500',
    teal: 'from-teal-400/20 to-teal-400/5 text-teal-500',
    coral: 'from-coral-500/20 to-coral-500/5 text-coral-500'
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={to}
        className="focus-ring glass-card group flex h-full flex-col items-start gap-4 p-5 transition-shadow hover:shadow-glow"
      >
        <span className={`inline-flex rounded-2xl bg-gradient-to-br p-3 ${accents[accent]}`}>
          <Icon size={26} />
        </span>
        <span className="font-display text-base font-semibold text-navy-900 dark:text-slate2-50">{label}</span>
      </Link>
    </motion.div>
  )
}
