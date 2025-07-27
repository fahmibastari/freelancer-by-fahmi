import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export const dynamic = "force-dynamic"; // biar session dicek real-time

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-xl text-center bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Freelancer Tracker 💼
        </h1>
        <p className="text-gray-600">
          Aplikasi pencatatan kerja freelance kamu: atur jadwal, fee, absen, dan rekap penghasilan.
        </p>

        <div className="flex justify-center gap-4">
          {session ? (
            <Link href="/dashboard">
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Buka Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
