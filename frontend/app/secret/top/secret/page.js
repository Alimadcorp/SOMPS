'use client'

import { useEffect, useState } from 'react'

export default function AnalyticsPage() {
  const [data, setData] = useState([])
  const [sortKey, setSortKey] = useState('totalPings')
  const [sortOrder, setSortOrder] = useState('desc')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('https://live.alimad.xyz/admin/topsecretpasswordthingy?key=alimadpassword&action=checkoutstats')
      .then(res => res.json())
      .then(obj => {
        const entries = Object.entries(obj).map(([name, stats]) => ({ name, ...stats }))
        setData(entries)
      })
      .catch(() => setError('Could not fetch stats'))
  }, [])

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey] || 0
    const bVal = b[sortKey] || 0
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
  })

  const setSort = key => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const formatTime = ms => {
    const d = new Date(ms)
    return isNaN(d) ? '-' : d.toLocaleString()
  }

  if (error) return <div>{error}</div>
  if (!data.length) return <div>Loading...</div>

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h1>Project Ping Analytics</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr>
            <Th label="Name" />
            <Th label="Total Pings" sortKey="totalPings" current={sortKey} order={sortOrder} setSort={setSort} />
            <Th label="Unique IDs" sortKey="uniqueIds" current={sortKey} order={sortOrder} setSort={setSort} />
            <Th label="Max Concurrent" sortKey="maxConcurrent.overall" current={sortKey} order={sortOrder} setSort={setSort} />
            <Th label="Last Ping" sortKey="lastPing" current={sortKey} order={sortOrder} setSort={setSort} />
            <Th label="Registered IDs" />
          </tr>
        </thead>
        <tbody>
          {sortedData.map(stat => (
            <tr key={stat.name} style={{ borderTop: '1px solid #ccc' }}>
              <td>{stat.name}</td>
              <td>{stat.totalPings}</td>
              <td>{stat.uniqueIds}</td>
              <td>{stat.maxConcurrent?.overall || 0}</td>
              <td>{formatTime(stat.lastPing)}</td>
              <td>{stat.registeredIds.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ label, sortKey, current, order, setSort }) {
  if (!sortKey) return <th style={{ textAlign: 'left', padding: '4px 8px' }}>{label}</th>
  const isActive = current === sortKey
  const arrow = isActive ? (order === 'asc' ? '↑' : '↓') : ''
  return (
    <th
      onClick={() => setSort(sortKey)}
      style={{ cursor: 'pointer', textAlign: 'left', padding: '4px 8px' }}
    >
      {label} {arrow}
    </th>
  )
}
