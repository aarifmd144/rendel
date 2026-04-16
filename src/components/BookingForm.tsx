'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BookingForm({ houseId }: { houseId: string }) {
  const { data: session } = useSession()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  if (!session) {
    return (
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-blue-700">Please <Link href="/login" className="font-bold underline">login</Link> to book this house.</p>
      </div>
    )
  }

  if (session.user.role !== 'TENANT') {
    return (
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">Only tenants can book houses.</p>
        </div>
      )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end <= start) {
      setMessage('End date must be after start date.')
      setLoading(false)
      return
    }

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        houseId,
        startDate,
        endDate,
      }),
    })

    if (response.ok) {
      setMessage('Booking request sent successfully!')
      router.push('/tenant')
      router.refresh()
    } else {
      setMessage('Failed to send booking request.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? 'Processing...' : 'Request Booking'}
      </button>
      {message && <p className={`mt-2 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
    </form>
  )
}
