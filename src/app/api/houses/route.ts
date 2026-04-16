import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "OWNER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, address, price, images } = body;

    const house = await prisma.house.create({
      data: {
        title,
        description,
        address,
        price: parseFloat(price),
        images,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(house);
  } catch (error) {
    console.log(error, "HOUSE_CREATE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const houses = await prisma.house.findMany({
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(houses);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
