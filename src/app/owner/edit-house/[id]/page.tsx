import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import EditHouseForm from "@/components/EditHouseForm"

export default async function EditHousePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "OWNER") {
    redirect("/login")
  }

  const house = await prisma.house.findUnique({
    where: { id: params.id },
  })

  if (!house) {
    notFound()
  }

  if (house.ownerId !== session.user.id) {
    redirect("/owner")
  }

  return (
    <div className="py-8">
      <EditHouseForm house={house} />
    </div>
  )
}
