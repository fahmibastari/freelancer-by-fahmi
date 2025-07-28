'use client'

import { useState } from "react"

export default function EditCompanyForm({
  company,
  onClose,
  onUpdated,
}: {
  company: any
  onClose: () => void
  onUpdated: (updated: any) => void
}) {
  const [name, setName] = useState(company.name)
  const [address, setAddress] = useState(company.address || "")
  const [fee, setFee] = useState(company.feePerSession?.toString() || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/company/${company.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        address,
        feePerSession: parseFloat(fee),
      }),
    })

    setLoading(false)

    if (res.ok) {
      const updated = await res.json()
      onUpdated(updated)
      onClose()
    } else {
      const err = await res.json()
      alert(err.error || "Gagal update")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Nama Perusahaan"
      />
      <input
        value={address}
        onChange={e => setAddress(e.target.value)}
        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Alamat"
      />
      <input
        type="number"
        value={fee}
        onChange={e => setFee(e.target.value)}
        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Fee per Session"
      />

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          onClick={onClose}
          type="button"
          className="text-gray-400 hover:text-white px-4 py-2 transition"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
