import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function TenantDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "TENANT") {
    redirect("/login")
  }

  const bookings = await prisma.booking.findMany({
    where: {
      tenantId: session.user.id,
    },
    include: {
        house: true
    },
    orderBy: {
        createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <Link href={`/houses/${booking.houseId}`} className="text-lg font-medium text-blue-600 hover:underline truncate">
                    {booking.house.title}
                  </Link>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {booking.house.address}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {bookings.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              You haven&apos;t made any bookings yet. <Link href="/" className="text-blue-600 underline">Browse houses</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
