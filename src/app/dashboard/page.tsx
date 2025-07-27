import { getServerSession, Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardContent from "./DashboardContent"
import { Company } from "@prisma/client"

export type CompanyWithSessions = Company & {
  sessions: Session[]
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return <DashboardContent />
}
