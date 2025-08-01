import { prisma } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 })
  }

  const data = await req.json()

  const updated = await prisma.company.update({
    where: { id },
    data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 })
  }

  await prisma.session.deleteMany({ where: { companyId: id } })
  await prisma.company.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
