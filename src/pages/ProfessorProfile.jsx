import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, Clock, DoorOpen, Navigation, UserX } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { ProfessorStatusBadge } from '../components/StatusBadge'
import { useApp } from '../context/AppContext'

export default function ProfessorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { professors, buildings } = useApp()
  const professor = professors.find((p) => p.id === id)

  if (!professor) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <PageHeader title="Professor not found" />
        <div className="glass-card flex flex-col items-center gap-3 p-10">
          <UserX className="text-navy-400" size={32} />
          <p className="text-navy-500 dark:text-slate2-200/60">We couldn't find this professor's profile.</p>
        </div>
      </div>
    )
  }

  const building = buildings.find((b) => b.id === professor.buildingId)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Faculty profile" />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="bg-gradient-to-br from-amber-500/20 via-navy-800/0 to-teal-400/10 p-6 md:p-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500/40 to-teal-400/30 font-display text-3xl font-bold text-navy-900 dark:text-slate2-50">
              {professor.initials}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">{professor.name}</h2>
              <p className="text-navy-500 dark:text-slate2-200/60">{professor.department}</p>
              <ProfessorStatusBadge status={professor.status} className="mt-2" />
            </div>
          </div>

          {professor.statusReason && (
            <div className="mt-5 rounded-2xl bg-white/50 p-4 text-sm dark:bg-white/5">
              <p className="font-semibold">
                {professor.status === 'leave' ? 'On leave' : `Busy until ${professor.statusUntil}`}
              </p>
              <p className="text-navy-500 dark:text-slate2-200/60">{professor.statusReason}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-navy-100 p-6 dark:border-white/5 sm:grid-cols-2 md:p-8">
          <InfoRow icon={DoorOpen} label="Cabin" value={professor.cabin} />
          <InfoRow icon={Clock} label="Office Hours" value={professor.officeHours} />
          <InfoRow icon={Mail} label="Email" value={professor.email} />
          <InfoRow icon={Phone} label="Phone" value={professor.phone} />
        </div>

        <div className="flex flex-col gap-3 border-t border-navy-100 p-6 dark:border-white/5 sm:flex-row md:p-8">
          <button
            onClick={() => navigate(`/map?focus=${professor.buildingId}`)}
            className="btn-primary flex-1"
          >
            <Navigation size={18} /> Navigate to {building?.name || 'cabin'}
          </button>
          <a href={`mailto:${professor.email}`} className="btn-secondary flex-1">
            <Mail size={18} /> Send email
          </a>
        </div>
      </motion.div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-600 dark:bg-white/10 dark:text-slate2-100">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-slate2-200/40">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  )
}
