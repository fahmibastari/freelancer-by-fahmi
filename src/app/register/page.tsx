'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
      headers: { 'Content-Type': 'application/json' }
    })
  
    const data = await res.json() // ✅ ambil responsenya
  
    setLoading(false)
  
    if (!res.ok) {
      alert(data.error || 'Register failed') // ✅ tampilkan error dari server
      return
    }
  
    router.push('/login') // ✅ sukses → redirect
  }  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-4"
  >
    <h2 className="text-3xl font-bold text-center text-gray-800">Daftar Sekarang!</h2>

    <input
      type="text"
      placeholder="Full Name"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800 bg-white"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />

    <input
      type="email"
      placeholder="Email Address"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800 bg-white"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Password"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800 bg-white"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button
      type="submit"
      className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Registering...' : 'Sign Up'}
    </button>
  </form>
</div>
  )
}
