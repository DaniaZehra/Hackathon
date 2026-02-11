import { useState, useRef, useEffect } from 'react'
import '../App.css'
import './user_dashboard.css'
import Sidebar from '../components/Sidebar.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function VoiceAssistant({
  user,
  onGoToDashboard,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
  onGoToProfile,
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState('Tap the mic and ask about your balance or monthly spends.')
  const [error, setError] = useState('')
  const [replyUrl, setReplyUrl] = useState('')

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const audioRef = useRef(null)

  useEffect(() => {
    return () => {
      if (replyUrl) {
        URL.revokeObjectURL(replyUrl)
      }
    }
  }, [replyUrl])

  const startRecording = async () => {
    setError('')
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Microphone not supported in this browser.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await sendToBackend(audioBlob)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setStatus('Listening...')
    } catch (err) {
      setError('Could not access microphone.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsProcessing(true)
      setStatus('Processing your request...')
    }
  }

  const sendToBackend = async (blob) => {
    try {
      const formData = new FormData()
      const username = user?.username || 'testuser'
      formData.append('file', blob, 'voice.webm')

      const response = await fetch(
        `${API_BASE_URL}/voice?username=${encodeURIComponent(username)}`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error('Voice API request failed.')
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setReplyUrl((oldUrl) => {
        if (oldUrl) URL.revokeObjectURL(oldUrl)
        return url
      })
      setStatus('Playing reply...')
      setIsProcessing(false)

      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while contacting the assistant.')
      setIsProcessing(false)
      setStatus('Tap the mic and try again.')
    }
  }

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording()
    } else if (!isProcessing) {
      startRecording()
    }
  }

  return (
    <div className="landing">
      <header className="header">
        <img className="header-logo" src="/logo.png" alt="SecureSpend" />
      </header>

      <div className="dashboard-layout">
        {/* Sidebar (same as dashboard) */}
        <Sidebar
          active="voice"
          onGoToDashboard={onGoToDashboard}
          onGoToVoiceAssistant={onGoToVoiceAssistant}
          onGoToAiAdvisor={onGoToAiAdvisor}
          onGoToTransactions={onGoToTransactions}
          onGoToProfile={onGoToProfile}
        />

        {/* Main content */}
        <main className="dashboard-main">
          <section className="voice-assistant-shell">
            <header className="voice-header">
              <div>
                <h2>Voice Assistant</h2>
                <p>Ask about your balance, monthly spends, or other banking info in Urdu.</p>
              </div>
              <span
                className={`voice-status-pill ${
                  isRecording ? 'recording' : isProcessing ? 'processing' : 'idle'
                }`}
              >
                {isRecording ? 'Listening' : isProcessing ? 'Processing' : 'Ready'}
              </span>
            </header>

            <div className="voice-main-row">
              <div className="voice-mic-panel">
                <button
                  type="button"
                  className={`voice-mic-button ${isRecording ? 'recording' : ''}`}
                  onClick={handleMicClick}
                  disabled={isProcessing}
                >
                  <span className="voice-mic-inner" />
                </button>
                <p className="voice-mic-caption">
                  {isRecording
                    ? 'Speak now...'
                    : isProcessing
                    ? 'Please wait while we process your request.'
                    : 'Tap the mic and say, for example: "mera balance kitna hai?"'}
                </p>
              </div>

              <div className="voice-side-panel">
                <h3>Session</h3>
                <p className="voice-status-text">{status}</p>
                {error && <p className="voice-error-text">{error}</p>}
                <audio ref={audioRef} src={replyUrl} controls style={{ width: '100%' }}>
                  Your browser does not support audio playback.
                </audio>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default VoiceAssistant