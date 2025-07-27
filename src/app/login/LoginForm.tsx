'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)
    if (res?.ok) {
      router.push('/dashboard')
    } else {
      alert('Login gagal')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Masuk Akun Kamu</h2>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition-colors 
                     text-white font-semibold rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
