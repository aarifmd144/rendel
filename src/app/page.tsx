import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const houses = await prisma.house.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Find Your Perfect Home
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Browse through our extensive list of rental properties.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {houses.map((house) => (
          <div key={house.id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
            <div className="h-48 bg-gray-200">
                {house.images ? (
                    <img src={house.images} alt={house.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-lg font-semibold text-gray-900">{house.title}</h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{house.description}</p>
              <p className="mt-4 text-lg font-bold text-blue-600">${house.price} / month</p>
              <p className="text-xs text-gray-400 mt-1">{house.address}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t">
              <Link
                href={`/houses/${house.id}`}
                className="w-full block text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
        {houses.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-12">No houses listed yet.</p>
        )}
      </div>
    </div>
  )
}
