// Mock "AI" search engine.
// Architected so a real LLM / vector-search backend can be swapped in later —
// just replace the body of `searchCampus` with an API call that returns the
// same shape: { id, type, title, subtitle, category, buildingId, score }[]

import departmentsData from '../data/departments.json'

const CATEGORY_LABELS = {
  professor: 'Professor',
  building: 'Building',
  department: 'Department',
  facility: 'Facility'
}

function normalize(str) {
  return (str || '').toLowerCase().trim().replace(/\s+/g, ' ')
}

function scoreMatch(haystack, needle) {
  const h = normalize(haystack)
  const n = normalize(needle)
  if (!n) return 0
  if (h === n) return 100
  if (h.startsWith(n)) return 85
  if (h.includes(n)) return 65
  // token overlap
  const hTokens = h.split(' ')
  const nTokens = n.split(' ')
  const overlap = nTokens.filter((t) => hTokens.some((ht) => ht.startsWith(t) && t.length > 1)).length
  if (overlap > 0) return 30 + overlap * 10
  return 0
}

export function searchCampus(query, { professors = [], buildings = [] } = {}) {
  const q = normalize(query)
  if (!q) return []

  const results = []

  professors.forEach((p) => {
    const score = Math.max(
      scoreMatch(p.name, q),
      scoreMatch(p.department, q) * 0.6,
      scoreMatch(p.cabin, q) * 0.8
    )
    if (score > 0) {
      results.push({
        id: p.id,
        type: 'professor',
        category: CATEGORY_LABELS.professor,
        title: p.name,
        subtitle: `${p.department} • Cabin ${p.cabin}`,
        buildingId: p.buildingId,
        score
      })
    }
  })

  buildings.forEach((b) => {
    const score = Math.max(
      scoreMatch(b.name, q),
      scoreMatch(b.code, q) * 0.9,
      scoreMatch(b.category, q) * 0.4,
      ...b.facilities.map((f) => scoreMatch(f, q) * 0.7)
    )
    if (score > 0) {
      results.push({
        id: b.id,
        type: 'building',
        category: CATEGORY_LABELS.building,
        title: b.name,
        subtitle: `${b.category} • ${b.workingHours}`,
        buildingId: b.id,
        score
      })
    }
  })

  departmentsData.forEach((d) => {
    const score = Math.max(scoreMatch(d.name, q), scoreMatch(d.hod, q) * 0.5)
    if (score > 0) {
      results.push({
        id: d.id,
        type: 'department',
        category: CATEGORY_LABELS.department,
        title: d.name,
        subtitle: `Head: ${d.hod}`,
        buildingId: d.buildingId,
        score
      })
    }
  })

  buildings.forEach((b) => {
    b.facilities.forEach((f, idx) => {
      const score = scoreMatch(f, q)
      if (score > 0) {
        results.push({
          id: `${b.id}-fac-${idx}`,
          type: 'facility',
          category: CATEGORY_LABELS.facility,
          title: f,
          subtitle: `Inside ${b.name}`,
          buildingId: b.id,
          score
        })
      }
    })
  })

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
}

export function bestMatch(query, ctx) {
  const results = searchCampus(query, ctx)
  return results.length ? results[0] : null
}

export const SUGGESTED_QUERIES = [
  'Dr Amit Sharma',
  'Library',
  'Registrar Office',
  'Computer Science Department',
  'Placement Cell',
  'Exam Cell',
  'IT Department',
  'Security Office',
  'Health Centre'
]
