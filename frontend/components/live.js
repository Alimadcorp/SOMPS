'use client'
import { useEffect, useState } from 'react'

export default function LiveStatus({ app = 'somps' }) {
  const [count, setCount] = useState('?')
  const [online, setOnline] = useState(false)

  useEffect(() => {
    let mounted = true
    async function ping() {
      try {
        const res = await fetch(`https://live.alimad.xyz/ping?app=${app}`)
        const text = await res.text()
        if (res.ok && mounted) {
          setOnline(true)
          setCount(text)
        } else throw "fail"
      } catch {
        if (mounted) {
          setOnline(false)
          setCount('Offline')
        }
      }
    }
    ping()
    const id = setInterval(ping, 10000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [app])

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'monospace',
      color: '#0f0',
      gap: '6px',
      transition: "all"
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: online ? 'lime' : 'red',
        animation: online ? 'pulse 4s infinite ease-in-out' : 'none',
        transition: "all"
      }} />
      <span style={{ color: online ? 'lime' : 'red' }}>{online ? `Online: ${count}` : 'Offline'}</span>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </span>
  )
}