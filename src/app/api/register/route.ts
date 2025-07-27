import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  
if (!email || !name || !password) {
    return NextResponse.json({ error: "Incomplete data" }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  })

  return NextResponse.json({ message: 'User created', user })
}
