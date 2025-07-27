import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginForm from "./LoginForm"

export const dynamic = "force-dynamic"; // ✅ ini!
export const fetchCache = "force-no-store"; // ✅ ini juga!

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return <LoginForm />
}
