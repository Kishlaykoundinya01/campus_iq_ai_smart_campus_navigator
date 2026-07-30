import React, { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SearchX, Layers, MapPinned } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SearchBox from '../components/SearchBox'
import ProfessorCard from '../components/ProfessorCard'
import BuildingCard from '../components/BuildingCard'
import { useApp } from '../context/AppContext'
import { searchCampus } from '../services/aiSearchService'

const TYPE_ICON = {
  department: Layers,
  facility: MapPinned
}

export default function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const { professors, buildings } = useApp()

  const results = useMemo(() => searchCampus(query, { professors, buildings }), [query, professors, buildings])

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Search results" subtitle={query ? `Showing results for "${query}"` : 'Search the campus'} />
      <div className="mb-8">
        <SearchBox size="sm" />
      </div>

      {results.length === 0 ? (
        <div className="glass-card flex flex-col items-center gap-3 p-10 text-center">
          <SearchX className="text-navy-400" size={32} />
          <p className="font-display font-semibold">No matches found</p>
          <p className="max-w-sm text-sm text-navy-500 dark:text-slate2-200/60">
            Try a professor's name, a building, a department, or a facility like "Health Centre" or "Placement Cell".
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r, i) => {
            if (r.type === 'professor') {
              const professor = professors.find((p) => p.id === r.id)
              if (!professor) return null
              return <ProfessorCard key={`p-${r.id}`} professor={professor} delay={i * 0.04} />
            }

            if (r.type === 'building') {
              const building = buildings.find((b) => b.id === r.id)
              if (!building) return null
              return <BuildingCard key={`b-${r.id}`} building={building} delay={i * 0.04} />
            }

            const Icon = TYPE_ICON[r.type] || Layers
            return (
              <motion.div
                key={`${r.type}-${r.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Link to={`/map?focus=${r.buildingId}`} className="focus-ring glass-card flex items-center gap-4 p-4 hover:shadow-glow">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display font-semibold">{r.title}</span>
                    <span className="block truncate text-sm text-navy-500 dark:text-slate2-200/60">{r.subtitle}</span>
                  </span>
                  <span className="chip shrink-0 bg-navy-100 text-navy-600 dark:bg-white/10 dark:text-slate2-200">{r.category}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
