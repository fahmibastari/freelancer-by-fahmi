import { prisma } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 })
  }

  const data = await req.json()

    // ✅ Tambahkan di sini
    if (data.attended !== undefined) {
      data.attended = Boolean(data.attended)
    }
  
    if (data.date) {
      data.date = new Date(data.date)
    }

  const updated = await prisma.session.update({
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

  // ❗ Hapus hanya session-nya
  await prisma.session.delete({
    where: { id }
  })

  return NextResponse.json({ success: true })
}


