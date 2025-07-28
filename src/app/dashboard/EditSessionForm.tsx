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
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
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
        date: new Date(date).toISOString(),
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
    <form onSubmit={handleSubmit} className="space-y-3 w-full bg-neutral-900 p-4 rounded-lg border border-neutral-800">
      <input
        type="datetime-local"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="number"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Fee"
      />

      <label className="flex items-center gap-3 text-sm text-white">
        <input
          type="checkbox"
          checked={attended}
          onChange={(e) => setAttended(e.target.checked)}
          className="accent-blue-600 w-4 h-4"
        />
        Hadir?
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Update"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-neutral-600 text-gray-400 hover:text-white rounded-lg transition"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
