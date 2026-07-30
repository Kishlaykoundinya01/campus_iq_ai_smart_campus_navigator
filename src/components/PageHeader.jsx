import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PageHeader({ title, subtitle, back = true, action }) {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 flex items-start justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        {back && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="focus-ring mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-700 hover:bg-amber-500/20 dark:bg-white/10 dark:text-slate2-100"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-navy-500 dark:text-slate2-200/60">{subtitle}</p>}
        </div>
      </div>
      {action}
    </motion.div>
  )
}
