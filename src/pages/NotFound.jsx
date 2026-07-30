import React from 'react'
import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-950 px-6 text-center text-slate2-50">
      <Compass size={40} className="text-amber-500" />
      <h1 className="font-display text-2xl font-bold">Page not found</h1>
      <p className="text-slate2-200/60">This location doesn't exist on the CampusIQ map.</p>
      <Link to="/home" className="btn-primary mt-2">Back to Home</Link>
    </div>
  )
}
