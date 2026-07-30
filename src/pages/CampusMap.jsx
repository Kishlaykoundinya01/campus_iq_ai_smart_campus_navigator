import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Layers, Accessibility, X, Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import CampusMapView from '../components/CampusMapView'
import { BuildingStatusBadge } from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import departmentsData from '../data/departments.json'

export default function CampusMap() {
  const { buildings, professors } = useApp()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const focusId = params.get('focus')
  const [selectedId, setSelectedId] = useState(focusId || null)

  useEffect(() => {
    setSelectedId(focusId || null)
  }, [focusId])

  function selectBuilding(id) {
    setSelectedId(id)
    setParams(id ? { focus: id } : {})
  }

  const selected = buildings.find((b) => b.id === selectedId)
  const selectedDepartments = selected ? departmentsData.filter((d) => d.buildingId === selected.id) : []
  const selectedProfessors = selected ? professors.filter((p) => p.buildingId === selected.id) : []

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Smart Campus Map" subtitle="Tap any building to see live status, departments and faculty" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <CampusMapView buildings={buildings} selectedId={selectedId} onSelect={selectBuilding} />

        <div className="glass-card min-h-[200px] p-5">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-display text-xl font-bold">{selected.name}</p>
                    <p className="text-sm text-navy-500 dark:text-slate2-200/60">{selected.category} • {selected.code}</p>
                  </div>
                  <button
                    onClick={() => selectBuilding(null)}
                    aria-label="Close details"
                    className="focus-ring rounded-lg p-1.5 text-navy-400 hover:bg-navy-100 dark:hover:bg-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>

                <BuildingStatusBadge status={selected.status} className="mb-4" />

                {selected.statusReason && (
                  <div className="mb-4 rounded-xl bg-amber-500/10 p-3 text-sm">
                    <p className="font-semibold">{selected.statusReason}</p>
                    {selected.statusUntil && <p className="text-navy-500 dark:text-slate2-200/60">Until {selected.statusUntil}</p>}
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-navy-600 dark:text-slate2-200/70">
                    <Clock size={15} /> {selected.workingHours}
                  </div>
                  <div className="flex items-center gap-2 text-navy-600 dark:text-slate2-200/70">
                    <Accessibility size={15} /> {selected.accessible ? 'Wheelchair accessible' : 'Limited accessibility'}
                  </div>
                  <div className="flex items-start gap-2 text-navy-600 dark:text-slate2-200/70">
                    <Layers size={15} className="mt-0.5" />
                    <span>{selected.floors} floor{selected.floors > 1 ? 's' : ''} • {selected.facilities.join(', ')}</span>
                  </div>
                </div>

                {selectedDepartments.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-slate2-200/50">Departments</p>
                    <div className="space-y-1.5">
                      {selectedDepartments.map((d) => (
                        <p key={d.id} className="text-sm">{d.name}</p>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProfessors.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-slate2-200/50">
                      <Users size={12} /> Faculty here
                    </p>
                    <div className="space-y-2">
                      {selectedProfessors.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => navigate(`/professor/${p.id}`)}
                          className="focus-ring flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-amber-500/10"
                        >
                          {p.name} <span className="text-xs text-amber-500">View →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 text-center text-navy-500 dark:text-slate2-200/50"
              >
                <Layers size={26} />
                <p>Select a building on the map to see details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {buildings.map((b) => (
          <button
            key={b.id}
            onClick={() => selectBuilding(b.id)}
            className={`focus-ring glass-card p-3 text-left text-sm transition-shadow hover:shadow-glow ${
              selectedId === b.id ? 'ring-2 ring-amber-500' : ''
            }`}
          >
            <p className="truncate font-semibold">{b.name}</p>
            <BuildingStatusBadge status={b.status} className="mt-1.5" />
          </button>
        ))}
      </div>
    </div>
  )
}
