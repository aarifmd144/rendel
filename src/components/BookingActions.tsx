'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface BookingActionsProps {
  bookingId: string
  currentStatus: string
}

export default function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateStatus = async (status: 'APPROVED' | 'REJECTED') => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (currentStatus !== 'PENDING') return null

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleUpdateStatus('APPROVED')}
        disabled={isLoading}
        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {isLoading ? '...' : 'Approve'}
      </button>
      <button
        onClick={() => handleUpdateStatus('REJECTED')}
        disabled={isLoading}
        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        {isLoading ? '...' : 'Reject'}
      </button>
    </div>
  )
}
