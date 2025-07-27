'use client'
import { useState } from "react"

export default function EditCompanyForm({ company, onClose, onUpdated }: {
  company: any,
  onClose: () => void,
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
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <input value={name} onChange={e => setName(e.target.value)} className="border px-2 py-1 w-full" />
      <input value={address} onChange={e => setAddress(e.target.value)} className="border px-2 py-1 w-full" />
      <input value={fee} onChange={e => setFee(e.target.value)} className="border px-2 py-1 w-full" type="number" />
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-1 rounded">Simpan</button>
        <button onClick={onClose} type="button" className="text-gray-600">Batal</button>
      </div>
    </form>
  )
}
