import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TENANT") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { houseId, startDate, endDate } = body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return new NextResponse("End date must be after start date", { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        houseId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        tenantId: session.user.id,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.log(error, "BOOKING_CREATE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
