'use client'

import { useState } from "react"

export default function CompanyForm({ onAdded }: { onAdded?: (company: any) => void }) {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/company", {
      method: "POST",
      body: JSON.stringify({
        name,
        address,
      }),
      headers: { "Content-Type": "application/json" },
    })

    setLoading(false)
    if (res.ok) {
      const created = await res.json()
      onAdded?.(created)
      alert("Perusahaan berhasil ditambahkan!")
      setName("")
      setAddress("")
      window.location.reload()
    } else {
      const err = await res.json()
      alert(err.error || "Gagal menambah perusahaan")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-900 border border-neutral-800 shadow-lg rounded-2xl p-8 w-full max-w-lg mx-auto space-y-5 mt-10"
    >
      <h2 className="text-2xl font-bold text-white text-center">Tambah Perusahaan</h2>

      <input
        type="text"
        placeholder="Nama Perusahaan"
        className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Alamat (Opsional)"
        className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  )
}
