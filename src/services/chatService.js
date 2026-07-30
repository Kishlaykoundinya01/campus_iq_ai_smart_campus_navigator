// Mock rule-based AI assistant. Swap `answerQuery` internals for a real LLM
// call later — keep the same return shape: { text, action?: { label, to } }

import { searchCampus } from './aiSearchService'

function normalize(str) {
  return (str || '').toLowerCase()
}

function findProfessorByName(query, professors) {
  const q = normalize(query)
  return professors.find((p) => q.includes(normalize(p.name).replace('dr. ', '').replace('dr ', '')) || normalize(p.name).includes(q))
}

function statusLine(p) {
  switch (p.status) {
    case 'available':
      return `${p.name} is available right now in cabin ${p.cabin}.`
    case 'teaching':
      return `${p.name} is currently teaching (${p.statusReason || 'in class'}) and will be free around ${p.statusUntil}.`
    case 'meeting':
      return `${p.name} is in a meeting (${p.statusReason || 'busy'}) until ${p.statusUntil}.`
    case 'break':
      return `${p.name} is on a short break until ${p.statusUntil}.`
    case 'leave':
      return `${p.name} is on leave (${p.statusReason || ''}) — try again ${p.statusUntil || 'later'}.`
    default:
      return `${p.name} is currently unavailable.`
  }
}

function buildingStatusLine(b) {
  if (b.status === 'open') return `${b.name} is open. Working hours: ${b.workingHours}.`
  if (b.status === 'limited') return `${b.name} has limited access right now — ${b.statusReason}, until ${b.statusUntil}.`
  if (b.status === 'restricted') return `${b.name} is restricted — ${b.statusReason}, until ${b.statusUntil}.`
  return `${b.name} is closed — ${b.statusReason || 'no reason given'}.`
}

export function answerQuery(rawQuery, ctx) {
  const { professors, buildings } = ctx
  const q = normalize(rawQuery)

  if (/where.*(dr|professor|prof)|find.*(dr|professor)/.test(q) || /^dr\.?\s/.test(q)) {
    const prof = findProfessorByName(q, professors)
    if (prof) {
      const building = buildings.find((b) => b.id === prof.buildingId)
      return {
        text: `${statusLine(prof)} You'll find their cabin in ${building ? building.name : 'the academic block'}.`,
        action: { label: `Open ${prof.name}'s profile`, to: `/professor/${prof.id}` }
      }
    }
  }

  if (/exam center|exam centre|my exam/.test(q)) {
    return {
      text: 'I can look up your exam center — just share your roll number on the Exam Center Finder page.',
      action: { label: 'Open Exam Center Finder', to: '/exam-center' }
    }
  }

  if (/take me to|navigate to|where is/.test(q)) {
    const results = searchCampus(rawQuery, ctx)
    if (results.length) {
      const top = results[0]
      if (top.type === 'building') {
        const b = buildings.find((bd) => bd.id === top.id)
        return {
          text: `${b.name} is ${b.status === 'open' ? 'open now' : `currently ${b.status}`}. ${buildingStatusLine(b)}`,
          action: { label: `View on map`, to: `/map?focus=${b.id}` }
        }
      }
      if (top.type === 'professor') {
        const prof = professors.find((p) => p.id === top.id)
        return {
          text: statusLine(prof),
          action: { label: `Open ${prof.name}'s profile`, to: `/professor/${prof.id}` }
        }
      }
      return {
        text: `${top.title} is located inside ${buildings.find((b) => b.id === top.buildingId)?.name || 'campus'}.`,
        action: { label: 'View on map', to: `/map?focus=${top.buildingId}` }
      }
    }
  }

  if (/can i visit|is .* open|access/.test(q)) {
    const results = searchCampus(rawQuery, ctx).filter((r) => r.type === 'building')
    if (results.length) {
      const b = buildings.find((bd) => bd.id === results[0].id)
      return {
        text: buildingStatusLine(b),
        action: { label: 'View on map', to: `/map?focus=${b.id}` }
      }
    }
  }

  if (/who.*available.*it department|it department.*available/.test(q)) {
    const itProfs = professors.filter((p) => normalize(p.department).includes('it department'))
    const available = itProfs.filter((p) => p.status === 'available')
    if (available.length) {
      return { text: `${available.map((p) => p.name).join(', ')} ${available.length > 1 ? 'are' : 'is'} available in the IT Department right now.` }
    }
    return { text: 'No one in the IT Department is available right now. Try again shortly, or check their office hours on their profile.' }
  }

  if (/registrar/.test(q)) {
    const dept = buildings.find((b) => b.facilities.some((f) => normalize(f).includes('registrar')))
    return {
      text: `Registrar Office is on the ground floor of ${dept ? dept.name : 'the Administrative Block'}. ${dept ? buildingStatusLine(dept) : ''}`,
      action: dept ? { label: 'View on map', to: `/map?focus=${dept.id}` } : undefined
    }
  }

  // fallback: generic smart search
  const results = searchCampus(rawQuery, ctx)
  if (results.length) {
    const top = results[0]
    return {
      text: `Here's the closest match I found: ${top.title} (${top.category}). ${top.subtitle}.`,
      action: { label: 'View details', to: top.type === 'professor' ? `/professor/${top.id}` : `/map?focus=${top.buildingId}` }
    }
  }

  return {
    text: "I couldn't find that on campus yet. Try asking about a professor, building, department, or say 'Where is my exam center?'"
  }
}

export const SUGGESTED_PROMPTS = [
  'Where is Dr Sharma?',
  'Take me to Library',
  'Where is my Exam Center?',
  'Can I visit Engineering Block?',
  'Where is Registrar Office?',
  'Who is available in IT Department?'
]
