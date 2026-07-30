import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Search, Mic, MicOff, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { searchCampus, SUGGESTED_QUERIES } from '../services/aiSearchService'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

export default function SearchBox({ autoFocus = false, size = 'lg' }) {
  const { professors, buildings } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const { isListening, isSupported, start, stop } = useSpeechRecognition({
    onResult: (text) => {
      setQuery(text)
      goToResults(text)
    }
  })

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    return searchCampus(query, { professors, buildings }).slice(0, 5)
  }, [query, professors, buildings])

  function goToResults(q) {
    const value = (q ?? query).trim()
    if (!value) return
    navigate(`/search?q=${encodeURIComponent(value)}`)
    setFocused(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    goToResults()
  }

  const isLg = size === 'lg'

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`glass-card flex items-center gap-3 px-5 transition-shadow ${
            isLg ? 'py-4 md:py-5' : 'py-3'
          } ${focused ? 'ring-2 ring-amber-500/60' : ''}`}
        >
          <Search className={isLg ? 'h-6 w-6 text-amber-500 shrink-0' : 'h-5 w-5 text-amber-500 shrink-0'} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search a professor, building, office, or lab…"
            className={`focus-ring flex-1 bg-transparent placeholder:text-navy-500/60 dark:placeholder:text-slate2-200/40 ${
              isLg ? 'text-lg md:text-xl font-display' : 'text-base'
            }`}
            aria-label="Search campus"
          />
          {isSupported && (
            <button
              type="button"
              onClick={() => (isListening ? stop() : start())}
              aria-pressed={isListening}
              aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
              className={`focus-ring flex items-center justify-center rounded-full p-2.5 transition-colors ${
                isListening ? 'bg-coral-500 text-white animate-pulse' : 'bg-navy-100 dark:bg-white/10 text-navy-700 dark:text-slate2-100 hover:bg-amber-500/20'
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          <button type="submit" className="btn-primary !px-4 !py-2.5 hidden sm:inline-flex">
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {focused && (query.trim() ? suggestions.length > 0 : true) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="glass-card absolute z-30 mt-2 w-full overflow-hidden p-2"
          >
            {query.trim() ? (
              suggestions.map((s) => (
                <button
                  key={`${s.type}-${s.id}`}
                  onMouseDown={() => goToResults(s.title)}
                  className="focus-ring flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-amber-500/10"
                >
                  <span>
                    <span className="font-medium">{s.title}</span>
                    <span className="ml-2 text-xs text-navy-500 dark:text-slate2-200/60">{s.subtitle}</span>
                  </span>
                  <span className="chip bg-navy-100 text-navy-600 dark:bg-white/10 dark:text-slate2-200">{s.category}</span>
                </button>
              ))
            ) : (
              <div className="p-2">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-slate2-200/50">
                  Try searching
                </p>
                <div className="flex flex-wrap gap-2 px-2 pb-1">
                  {SUGGESTED_QUERIES.slice(0, 6).map((s) => (
                    <button
                      key={s}
                      onMouseDown={() => goToResults(s)}
                      className="focus-ring chip bg-navy-100 text-navy-700 hover:bg-amber-500/20 dark:bg-white/10 dark:text-slate2-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
