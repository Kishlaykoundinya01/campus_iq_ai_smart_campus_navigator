import React from 'react'
import { Circle } from 'lucide-react'

export const PROFESSOR_STATUS_META = {
  available: { label: 'Available', color: 'text-teal-500', dot: 'bg-teal-400', bg: 'bg-teal-400/10' },
  teaching: { label: 'Teaching', color: 'text-amber-500', dot: 'bg-amber-400', bg: 'bg-amber-400/10' },
  meeting: { label: 'In a Meeting', color: 'text-amber-500', dot: 'bg-amber-400', bg: 'bg-amber-400/10' },
  break: { label: 'On a Break', color: 'text-amber-500', dot: 'bg-amber-400', bg: 'bg-amber-400/10' },
  leave: { label: 'On Leave', color: 'text-coral-500', dot: 'bg-coral-400', bg: 'bg-coral-400/10' },
  unavailable: { label: 'Unavailable', color: 'text-coral-500', dot: 'bg-coral-400', bg: 'bg-coral-400/10' }
}

export const BUILDING_STATUS_META = {
  open: { label: 'Open', color: 'text-teal-500', dot: 'bg-teal-400', bg: 'bg-teal-400/10', map: '#2DD4BF' },
  limited: { label: 'Limited Access', color: 'text-amber-500', dot: 'bg-amber-400', bg: 'bg-amber-400/10', map: '#F5A623' },
  restricted: { label: 'Restricted', color: 'text-coral-500', dot: 'bg-coral-400', bg: 'bg-coral-400/10', map: '#FB6B6B' },
  closed: { label: 'Closed', color: 'text-slate-400', dot: 'bg-slate-400', bg: 'bg-slate-400/10', map: '#8A93AD' }
}

export function ProfessorStatusBadge({ status, className = '' }) {
  const meta = PROFESSOR_STATUS_META[status] || PROFESSOR_STATUS_META.unavailable
  return (
    <span className={`chip ${meta.bg} ${meta.color} ${className}`}>
      <Circle size={8} className={`${meta.dot} rounded-full`} fill="currentColor" strokeWidth={0} />
      {meta.label}
    </span>
  )
}

export function BuildingStatusBadge({ status, className = '' }) {
  const meta = BUILDING_STATUS_META[status] || BUILDING_STATUS_META.open
  return (
    <span className={`chip ${meta.bg} ${meta.color} ${className}`}>
      <Circle size={8} className={`${meta.dot} rounded-full`} fill="currentColor" strokeWidth={0} />
      {meta.label}
    </span>
  )
}
