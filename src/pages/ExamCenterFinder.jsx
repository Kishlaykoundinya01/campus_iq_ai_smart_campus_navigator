import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Clock, Armchair, Layers3, Navigation, TriangleAlert } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import examsData from '../data/exams.json'

export default function ExamCenterFinder() {
  const { buildings } = useApp()
  const navigate = useNavigate()
  const [roll, setRoll] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)

  function handleSearch(e) {
    e.preventDefault()
    const match = examsData.find(
      (x) => x.rollNumber.toLowerCase() === roll.trim().toLowerCase() || x.name.toLowerCase() === name.trim().toLowerCase()
    )
    if (match) {
      setResult(match)
      setNotFound(false)
    } else {
      setResult(null)
      setNotFound(true)
    }
  }

  const building = result ? buildings.find((b) => b.id === result.buildingId) : null

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Exam Center Finder" subtitle="Enter your roll number or name to find your exam center" />

      <form onSubmit={handleSearch} className="glass-card mb-6 space-y-4 p-5">
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="roll">Roll Number</label>
          <input
            id="roll"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            placeholder="e.g. CS2101"
            className="focus-ring w-full rounded-xl border border-navy-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <p className="text-center text-xs font-semibold text-navy-400">OR</p>
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="name">Full Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ananya Kulkarni"
            className="focus-ring w-full rounded-xl border border-navy-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          <Search size={18} /> Find my exam center
        </button>
        <p className="text-center text-xs text-navy-400">
          Try: CS2101, CS2142, EC1187, PH0932 — or their full names
        </p>
      </form>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-slate2-200/50">Exam center found</p>
            <p className="mt-1 font-display text-xl font-bold">{result.name}</p>
            <p className="text-sm text-navy-500 dark:text-slate2-200/60">{result.department} • {result.examName}</p>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <Detail icon={MapPin} label="Building" value={building?.name} />
              <Detail icon={Layers3} label="Floor" value={result.floor} />
              <Detail icon={Armchair} label="Room / Seat" value={`${result.room} • ${result.seat}`} />
              <Detail icon={Clock} label="Reporting Time" value={`${result.date}, ${result.reportingTime}`} />
            </div>

            <div className="mt-5 rounded-xl bg-teal-400/10 p-3 text-sm text-teal-600 dark:text-teal-300">
              Estimated walking time from Main Gate: <strong>{result.walkingTime}</strong>
            </div>

            <button
              onClick={() => navigate(`/map?focus=${result.buildingId}`)}
              className="btn-primary mt-5 w-full"
            >
              <Navigation size={18} /> Navigate to exam room
            </button>
          </motion.div>
        )}

        {notFound && (
          <motion.div
            key="notfound"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card flex flex-col items-center gap-3 p-8 text-center"
          >
            <TriangleAlert className="text-coral-500" size={28} />
            <p className="font-display font-semibold">No matching exam record</p>
            <p className="text-sm text-navy-500 dark:text-slate2-200/60">
              Double-check your roll number or name, or contact the Examination Cell in the Administrative Block.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-600 dark:bg-white/10 dark:text-slate2-100">
        <Icon size={15} />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-slate2-200/40">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}
