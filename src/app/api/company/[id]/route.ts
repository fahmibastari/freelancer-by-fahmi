import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()

  const updated = await prisma.company.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.session.deleteMany({ where: { companyId: params.id } })
  await prisma.company.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
