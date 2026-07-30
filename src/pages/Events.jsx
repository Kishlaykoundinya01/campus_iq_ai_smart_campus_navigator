import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import eventsData from '../data/events.json'
import { useApp } from '../context/AppContext'

const CATEGORY_COLOR = {
  Cultural: 'bg-amber-400/15 text-amber-500',
  Academic: 'bg-teal-400/15 text-teal-500',
  Sports: 'bg-coral-500/15 text-coral-500',
  Placement: 'bg-teal-400/15 text-teal-500',
  Exam: 'bg-coral-500/15 text-coral-500'
}

export default function Events() {
  const { buildings } = useApp()

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Today's Events" subtitle="What's happening across campus" />
      <div className="space-y-4">
        {eventsData.map((e, i) => {
          const building = buildings.find((b) => b.id === e.buildingId)
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className={`chip ${CATEGORY_COLOR[e.category] || 'bg-navy-100 text-navy-600'}`}>{e.category}</span>
                <span className="text-xs font-semibold text-navy-500 dark:text-slate2-200/50">{e.date}</span>
              </div>
              <p className="font-display text-lg font-semibold">{e.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-navy-500 dark:text-slate2-200/60">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} /> {e.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} /> {e.time}
                </span>
              </div>
              {building && (
                <Link
                  to={`/map?focus=${building.id}`}
                  className="focus-ring mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-500 hover:underline"
                >
                  View on map →
                </Link>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
