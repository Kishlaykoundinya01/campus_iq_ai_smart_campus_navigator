import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, CircleUser } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { ProfessorStatusBadge, PROFESSOR_STATUS_META } from '../components/StatusBadge'
import { useApp } from '../context/AppContext'

const STATUS_OPTIONS = Object.keys(PROFESSOR_STATUS_META)

export default function ProfessorDashboard() {
  const { professors, updateProfessorStatus } = useApp()
  const [selectedId, setSelectedId] = useState(professors[0]?.id)
  const professor = professors.find((p) => p.id === selectedId)

  const [status, setStatus] = useState(professor.status)
  const [reason, setReason] = useState(professor.statusReason)
  const [endTime, setEndTime] = useState(professor.statusUntil)
  const [saved, setSaved] = useState(false)

  function selectProfessor(id) {
    const p = professors.find((pr) => pr.id === id)
    setSelectedId(id)
    setStatus(p.status)
    setReason(p.statusReason)
    setEndTime(p.statusUntil)
    setSaved(false)
  }

  function save() {
    updateProfessorStatus(selectedId, {
      name: professor.name,
      status,
      statusReason: reason,
      statusUntil: endTime
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Availability Dashboard" subtitle="Update your status so students always know when to visit" />

      <div className="glass-card mb-6 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-slate2-200/50">
          Viewing as (demo)
        </p>
        <div className="flex flex-wrap gap-2">
          {professors.map((p) => (
            <button
              key={p.id}
              onClick={() => selectProfessor(p.id)}
              className={`focus-ring flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                p.id === selectedId
                  ? 'bg-amber-500 text-navy-950'
                  : 'bg-navy-100 text-navy-700 hover:bg-amber-500/20 dark:bg-white/10 dark:text-slate2-100'
              }`}
            >
              <CircleUser size={16} /> {p.name}
            </button>
          ))}
        </div>
      </div>

      <motion.div key={selectedId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-teal-400/20 font-display text-xl font-bold">
            {professor.initials}
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{professor.name}</p>
            <p className="text-sm text-navy-500 dark:text-slate2-200/60">{professor.cabin} • {professor.department}</p>
            <ProfessorStatusBadge status={professor.status} className="mt-1.5" />
          </div>
        </div>

        <p className="mb-2 text-sm font-semibold">Set your status</p>
        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {STATUS_OPTIONS.map((s) => {
            const meta = PROFESSOR_STATUS_META[s]
            const active = status === s
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`focus-ring rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'border-navy-100 text-navy-600 hover:border-amber-500/40 dark:border-white/10 dark:text-slate2-200'
                }`}
              >
                {meta.label}
              </button>
            )
          })}
        </div>

        <label className="mb-1 block text-sm font-semibold" htmlFor="reason">
          Reason (optional)
        </label>
        <input
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Department meeting"
          className="focus-ring mb-4 w-full rounded-xl border border-navy-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5"
        />

        <label className="mb-1 block text-sm font-semibold" htmlFor="until">
          Available again at
        </label>
        <input
          id="until"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="e.g. 2:30 PM"
          className="focus-ring mb-6 w-full rounded-xl border border-navy-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5"
        />

        <button onClick={save} className="btn-primary w-full">
          {saved ? (
            <>
              <Check size={18} /> Status updated
            </>
          ) : (
            'Update status'
          )}
        </button>
        <p className="mt-3 text-center text-xs text-navy-500 dark:text-slate2-200/50">
          Students searching your name will see this update immediately.
        </p>
      </motion.div>
    </div>
  )
}
