import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BUILDING_STATUS_META } from './StatusBadge'

const GATE = { x: 4, y: 92, label: 'Main Gate' }

function pathBetween(a, b) {
  const midX = (a.x + b.x) / 2
  return `M ${a.x} ${a.y} Q ${midX} ${a.y} ${midX} ${(a.y + b.y) / 2} T ${b.x} ${b.y}`
}

export default function CampusMapView({ buildings, selectedId, onSelect, height = 'h-[420px] md:h-[560px]' }) {
  const selected = useMemo(() => buildings.find((b) => b.id === selectedId), [buildings, selectedId])

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-3xl bg-navy-900 dark:bg-navy-950`}>
      <div className="absolute inset-0 bg-grid-glow" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-[0.07]">
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#fff" strokeWidth="0.15" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#fff" strokeWidth="0.15" />
        ))}
      </svg>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* Main gate marker */}
        <circle cx={GATE.x} cy={GATE.y} r="1.4" fill="#F5A623" />
        <text x={GATE.x} y={GATE.y + 4.5} fontSize="2.6" fill="#FFB84D" textAnchor="middle" className="font-mono">
          GATE
        </text>

        <AnimatePresence>
          {selected && (
            <motion.path
              key={selected.id}
              d={pathBetween(GATE, selected)}
              fill="none"
              stroke="#F5A623"
              strokeWidth="0.6"
              strokeDasharray="2 1.6"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>

        {buildings.map((b) => {
          const meta = BUILDING_STATUS_META[b.status] || BUILDING_STATUS_META.open
          const isSelected = b.id === selectedId
          return (
            <g
              key={b.id}
              transform={`translate(${b.x}, ${b.y})`}
              className="cursor-pointer"
              onClick={() => onSelect(b.id)}
              role="button"
              tabIndex={0}
              aria-label={`${b.name}, ${meta.label}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(b.id)
              }}
            >
              {isSelected && (
                <motion.circle
                  r="3.2"
                  fill="none"
                  stroke={meta.map}
                  strokeWidth="0.4"
                  initial={{ opacity: 0.7, r: 2 }}
                  animate={{ opacity: 0, r: 5.5 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <circle r={isSelected ? '2.4' : '2'} fill={meta.map} stroke="#0A0E1F" strokeWidth="0.3" />
              <text y="4.6" fontSize="2.3" fill="#F7F8FC" textAnchor="middle" className="font-mono select-none">
                {b.code}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 md:bottom-4 md:left-4">
        {Object.entries(BUILDING_STATUS_META).map(([key, meta]) => (
          <span key={key} className="chip bg-navy-950/70 text-slate2-100 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full" style={{ background: meta.map }} />
            {meta.label}
          </span>
        ))}
      </div>
    </div>
  )
}
