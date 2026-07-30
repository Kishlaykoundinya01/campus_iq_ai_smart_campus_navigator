import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechRecognition({ onResult } = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [interimText, setInterimText] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }
    setIsSupported(true)
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-IN'

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) finalTranscript += transcript
        else interim += transcript
      }
      setInterimText(interim)
      if (finalTranscript) {
        onResult && onResult(finalTranscript.trim())
        setInterimText('')
      }
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    return () => {
      recognition.onresult = null
      recognition.onend = null
      recognition.onerror = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onResult])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch {
      // already started
    }
  }, [])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  return { isListening, isSupported, interimText, start, stop }
}
