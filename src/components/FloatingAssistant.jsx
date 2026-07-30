import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Mic } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { answerQuery, SUGGESTED_PROMPTS } from '../services/chatService'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

export default function FloatingAssistant() {
  const { professors, buildings } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your CampusIQ assistant. Ask me where anyone or anything is." }
  ])
  const scrollRef = useRef(null)

  const { isListening, isSupported, start, stop } = useSpeechRecognition({
    onResult: (text) => sendMessage(text)
  })

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  function sendMessage(text) {
    const value = (text ?? input).trim()
    if (!value) return
    setMessages((prev) => [...prev, { role: 'user', text: value }])
    setInput('')
    setTimeout(() => {
      const reply = answerQuery(value, { professors, buildings })
      setMessages((prev) => [...prev, { role: 'assistant', text: reply.text, action: reply.action }])
    }, 350)
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage()
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Campus Assistant"
        className="focus-ring fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-navy-950 shadow-glow md:bottom-8 md:right-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={26} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={26} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass-card fixed bottom-24 right-5 z-40 flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden md:bottom-28 md:right-8"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="font-display font-semibold leading-none">CampusIQ Assistant</p>
                <p className="text-xs text-navy-500 dark:text-slate2-200/50">Ask anything about campus</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === 'user'
                        ? 'bg-amber-500 text-navy-950'
                        : 'bg-navy-100 text-navy-800 dark:bg-white/10 dark:text-slate2-50'
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.action && (
                      <button
                        onClick={() => {
                          navigate(m.action.to)
                          setOpen(false)
                        }}
                        className="focus-ring mt-2 inline-flex items-center gap-1 rounded-lg bg-navy-950/10 px-3 py-1.5 text-xs font-semibold hover:bg-navy-950/20 dark:bg-white/10 dark:hover:bg-white/20"
                      >
                        {m.action.label} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTED_PROMPTS.slice(0, 4).map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="focus-ring chip bg-navy-100 text-navy-700 hover:bg-amber-500/20 dark:bg-white/10 dark:text-slate2-100"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                className="focus-ring flex-1 rounded-xl bg-navy-100 px-4 py-2.5 text-sm dark:bg-white/10"
                aria-label="Message the assistant"
              />
              {isSupported && (
                <button
                  type="button"
                  onClick={() => (isListening ? stop() : start())}
                  aria-label="Voice input"
                  className={`focus-ring rounded-xl p-2.5 ${isListening ? 'bg-coral-500 text-white animate-pulse' : 'bg-navy-100 dark:bg-white/10'}`}
                >
                  <Mic size={18} />
                </button>
              )}
              <button type="submit" className="focus-ring rounded-xl bg-amber-500 p-2.5 text-navy-950">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
