import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { date, fee, companyId } = await req.json()

    if (!date || !fee || !companyId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newSession = await prisma.session.create({
      data: {
        date: new Date(date),
        fee,
        companyId,
        userId: user.id,
      },
    })

    return NextResponse.json(newSession, { status: 201 })
  } catch (error) {
    console.error("Failed to create session:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
