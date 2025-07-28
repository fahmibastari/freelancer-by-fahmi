import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, address } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const company = await prisma.company.create({
      data: {
        name,
        address,
        userId: user.id, // 🆕 penting biar tiap user beda data
      },
    });

    return NextResponse.json(company); // ✅ penting! ini yang dipanggil res.json()
  } catch (err) {
    console.error("Create company error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
