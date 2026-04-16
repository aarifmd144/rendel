import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function OwnerDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "OWNER") {
    redirect("/login")
  }

  const houses = await prisma.house.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
        bookings: {
            include: {
                tenant: true
            }
        }
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <Link
          href="/owner/add-house"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New House
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">My House Listings</h2>
        {houses.length === 0 ? (
          <p className="text-gray-500">You haven&apos;t listed any houses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house) => (
              <div key={house.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <h3 className="text-xl font-bold">{house.title}</h3>
                <p className="text-gray-600 line-clamp-2">{house.description}</p>
                <p className="font-semibold mt-2">${house.price} / month</p>
                <div className="mt-4 flex space-x-2">
                    <Link href={`/houses/${house.id}`} className="text-blue-600 hover:underline">View</Link>
                    <Link href={`/owner/edit-house/${house.id}`} className="text-green-600 hover:underline">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Booking Requests</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                  {houses.flatMap(h => h.bookings).map(booking => (
                      <li key={booking.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                  {booking.tenant.name} - House: {houses.find(h => h.id === booking.houseId)?.title}
                              </p>
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
                                      From: {new Date(booking.startDate).toLocaleDateString()} To: {new Date(booking.endDate).toLocaleDateString()}
                                  </p>
                              </div>
                          </div>
                      </li>
                  ))}
                  {houses.flatMap(h => h.bookings).length === 0 && (
                      <li className="px-4 py-4 text-gray-500">No booking requests found.</li>
                  )}
              </ul>
          </div>
      </section>
    </div>
  )
}
