'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Briefcase, Laptop2, LayoutDashboard, LogIn, UserPlus } from "lucide-react"

export default function HomeClient({ session }: { session: any }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-10 space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex justify-center"
          >
            <Laptop2 className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-white tracking-tight">
            Freelancer Tracker
          </h1>
          <p className="text-gray-400 text-base">
            Kelola kerja freelance kamu dengan mudah!
          </p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          {session ? (
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </motion.button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  <LogIn size={20} />
                  Login
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                >
                  <UserPlus size={20} />
                  Register
                </motion.button>
              </Link>
            </>
          )}
        </div>
        <div className="pt-6 text-center text-sm text-gray-500">
  Made by{" "}
  <a
    href="https://instagram.com/fahmibastari"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 hover:underline"
  >
    @fahmibastari
  </a>
</div>

      </motion.div>
    </main>
  )
}
