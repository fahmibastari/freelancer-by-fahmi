import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import HomeClient from "./HomeClient"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await getServerSession(authOptions)
  return <HomeClient session={session} />
}
