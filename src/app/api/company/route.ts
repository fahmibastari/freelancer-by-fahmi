// src/app/api/company/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, address, feePerSession } = await req.json();

  try {
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
        feePerSession,
        userId: user.id, // ✅ PENTING
      }
    })
    

    return NextResponse.json(company); // ✅ wajib return JSON valid
  } catch (err) {
    console.error("Error creating company:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
