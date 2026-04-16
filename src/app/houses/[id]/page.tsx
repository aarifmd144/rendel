import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import BookingForm from "@/components/BookingForm"

export default async function HouseDetailPage({ params }: { params: { id: string } }) {
  const house = await prisma.house.findUnique({
    where: { id: params.id },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!house) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="h-96 bg-gray-200">
           {house.images ? (
                <img src={house.images} alt={house.title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
        </div>
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{house.title}</h1>
              <p className="text-gray-500 mt-1">{house.address}</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">${house.price} / month</p>
          </div>
          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-wrap">{house.description}</p>
          </div>
          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold">Contact Owner</h2>
            <p className="mt-4 text-gray-600">{house.owner.name} ({house.owner.email})</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6">Book this House</h2>
          <BookingForm houseId={house.id} />
      </div>
    </div>
  )
}
