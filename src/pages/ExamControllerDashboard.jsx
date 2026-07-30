import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, FileSpreadsheet, Plus, ShieldAlert, Check, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { BuildingStatusBadge, BUILDING_STATUS_META } from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import examsData from '../data/exams.json'

const STATUS_OPTIONS = Object.keys(BUILDING_STATUS_META)

export default function ExamControllerDashboard() {
  const { buildings, updateBuildingStatus } = useApp()
  const [students, setStudents] = useState(examsData)
  const [fileName, setFileName] = useState('')
  const [importedPreview, setImportedPreview] = useState([])
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ rollNumber: '', name: '', department: '', room: '', seat: '' })

  const [selectedBuildingId, setSelectedBuildingId] = useState(buildings[0]?.id)
  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId)
  const [newStatus, setNewStatus] = useState(selectedBuilding?.status)
  const [reason, setReason] = useState('')
  const [until, setUntil] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = String(evt.target.result || '')
      const rows = text
        .split(/\r?\n/)
        .filter(Boolean)
        .slice(0, 6)
        .map((r) => r.split(','))
      setImportedPreview(rows)
    }
    reader.readAsText(file)
  }

  function confirmImport() {
    if (importedPreview.length < 2) return
    const [header, ...rows] = importedPreview
    const added = rows.map((cols, i) => {
      const obj = {}
      header.forEach((h, idx) => (obj[h.trim().toLowerCase()] = (cols[idx] || '').trim()))
      return {
        id: `import-${Date.now()}-${i}`,
        rollNumber: obj.roll || obj.rollnumber || `IMP-${i}`,
        name: obj.name || 'Unnamed Student',
        department: obj.department || 'Unassigned',
        examName: obj.exam || obj.examname || 'General Exam',
        buildingId: buildings[0]?.id,
        floor: obj.floor || '1st Floor',
        room: obj.room || 'TBD',
        seat: obj.seat || 'TBD',
        date: obj.date || 'TBD',
        reportingTime: obj.time || '9:00 AM',
        walkingTime: '—'
      }
    })
    setStudents((prev) => [...added, ...prev])
    setImportedPreview([])
    setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function addStudent(e) {
    e.preventDefault()
    if (!form.rollNumber || !form.name) return
    setStudents((prev) => [
      {
        id: `manual-${Date.now()}`,
        rollNumber: form.rollNumber,
        name: form.name,
        department: form.department || 'Unassigned',
        examName: 'General Exam',
        buildingId: buildings[0]?.id,
        floor: '1st Floor',
        room: form.room || 'TBD',
        seat: form.seat || 'TBD',
        date: 'TBD',
        reportingTime: '9:00 AM',
        walkingTime: '—'
      },
      ...prev
    ])
    setForm({ rollNumber: '', name: '', department: '', room: '', seat: '' })
  }

  function removeStudent(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  function applyBuildingStatus() {
    updateBuildingStatus(selectedBuildingId, {
      status: newStatus,
      statusReason: reason || (newStatus === 'open' ? '' : 'Updated by Examination Controller'),
      statusUntil: until
    })
    setConfirmed(true)
    setTimeout(() => setConfirmed(false), 2500)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Examination Controller Dashboard" subtitle="Manage students, seating and building access during exams" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Import */}
        <section className="glass-card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display font-semibold">
            <UploadCloud size={18} className="text-amber-500" /> Upload CSV / Excel
          </h2>
          <label className="focus-ring flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-navy-200 p-6 text-center text-sm text-navy-500 hover:border-amber-500/50 dark:border-white/10 dark:text-slate2-200/60">
            <FileSpreadsheet size={26} className="text-amber-500" />
            {fileName ? `Selected: ${fileName}` : 'Click to choose a .csv file (header row required)'}
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFile} />
          </label>

          {importedPreview.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-500">Preview</p>
              <div className="max-h-40 overflow-auto rounded-xl bg-navy-100 p-3 font-mono text-xs dark:bg-white/5">
                {importedPreview.map((row, i) => (
                  <p key={i} className={i === 0 ? 'font-bold text-amber-500' : ''}>{row.join(' | ')}</p>
                ))}
              </div>
              <button onClick={confirmImport} className="btn-primary mt-3 w-full !py-2.5 text-sm">
                <Check size={16} /> Import {importedPreview.length - 1} students
              </button>
            </div>
          )}
        </section>

        {/* Add manually */}
        <section className="glass-card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display font-semibold">
            <Plus size={18} className="text-amber-500" /> Add student manually
          </h2>
          <form onSubmit={addStudent} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Roll number"
                value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                className="focus-ring rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
              />
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="focus-ring rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
              />
            </div>
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="focus-ring w-full rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Room"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                className="focus-ring rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
              />
              <input
                placeholder="Seat number"
                value={form.seat}
                onChange={(e) => setForm({ ...form, seat: e.target.value })}
                className="focus-ring rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
              />
            </div>
            <button type="submit" className="btn-primary w-full !py-2.5 text-sm">
              Add student
            </button>
          </form>
        </section>
      </div>

      {/* Restrict buildings */}
      <section className="glass-card mt-6 p-5">
        <h2 className="mb-3 flex items-center gap-2 font-display font-semibold">
          <ShieldAlert size={18} className="text-coral-500" /> Restrict buildings during exams
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold">Building</label>
            <select
              value={selectedBuildingId}
              onChange={(e) => {
                setSelectedBuildingId(e.target.value)
                setNewStatus(buildings.find((b) => b.id === e.target.value)?.status)
              }}
              className="focus-ring w-full rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {selectedBuilding && <BuildingStatusBadge status={selectedBuilding.status} className="mt-3" />}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">New status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className={`focus-ring rounded-xl border px-3 py-2 text-xs font-semibold ${
                    newStatus === s ? 'border-amber-500 bg-amber-500/15 text-amber-600' : 'border-navy-100 text-navy-600 dark:border-white/10 dark:text-slate2-200'
                  }`}
                >
                  {BUILDING_STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>
          <input
            placeholder="Reason (e.g. Semester Examination)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="focus-ring rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
          />
          <input
            placeholder="Until (e.g. 1:00 PM)"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            className="focus-ring rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <button onClick={applyBuildingStatus} className="btn-primary mt-4 w-full md:w-auto">
          {confirmed ? <><Check size={18} /> Map updated</> : 'Apply and update map'}
        </button>
      </section>

      {/* Student list */}
      <section className="glass-card mt-6 overflow-hidden p-5">
        <h2 className="mb-3 font-display font-semibold">Exam seating list ({students.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-slate2-200/40">
                <th className="pb-2">Roll No.</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Room</th>
                <th className="pb-2">Seat</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-t border-navy-100 dark:border-white/5"
                >
                  <td className="py-2 font-mono text-xs">{s.rollNumber}</td>
                  <td className="py-2">{s.name}</td>
                  <td className="py-2">{s.room}</td>
                  <td className="py-2 font-mono text-xs">{s.seat}</td>
                  <td className="py-2 text-right">
                    <button onClick={() => removeStudent(s.id)} className="focus-ring rounded-lg p-1.5 text-navy-400 hover:bg-coral-500/10 hover:text-coral-500">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
