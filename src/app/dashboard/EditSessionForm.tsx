'use client'

import { useState } from "react"

export default function EditSessionForm({
  session,
  onUpdated,
  onCancel,
}: {
  session: {
    id: string
    date: string
    fee: number
    attended: boolean
  }
  onUpdated: (data: any) => void
  onCancel: () => void
}) {
  const [date, setDate] = useState(() => {
    const d = new Date(session.date)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset()) // agar tidak offset ke UTC
    return d.toISOString().slice(0, 16) // ambil 'YYYY-MM-DDTHH:mm'
  })
  
  
  const [fee, setFee] = useState(session.fee.toString())
  const [attended, setAttended] = useState(session.attended)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/session/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date(date).toISOString(), // ubah jadi full ISO format
        fee: parseFloat(fee),
        attended,
      }),      
    })

    const updated = await res.json()
    setLoading(false)
    if (res.ok) {
      onUpdated(updated)
    } else {
      alert(updated.error || "Gagal update session")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 w-full">
      <input
  type="datetime-local"
  value={date}
  onChange={e => setDate(e.target.value)}
  className="border px-2 py-1 rounded w-full"
/>


      <input
        type="number"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
        className="border px-2 py-1 rounded w-full"
      />

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={attended}
          onChange={(e) => setAttended(e.target.checked)}
        />
        Hadir?
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          {loading ? "Menyimpan..." : "Update"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 px-3 py-1 border border-gray-300 rounded"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
