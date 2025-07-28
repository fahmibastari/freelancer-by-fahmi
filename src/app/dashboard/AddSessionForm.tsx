import { useState } from "react"

export default function AddSessionForm({
  companyId,
  onAdded,
}: {
  companyId: string
  onAdded?: (session: any) => void
}) {
  const [date, setDate] = useState("")
  const [fee, setFee] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date(date).toISOString(),
        fee: parseFloat(fee),
        companyId,
      }),
    })

    setLoading(false)
    if (res.ok) {
      const newSession = await res.json()
      onAdded?.(newSession)
      setDate("")
      setFee("")
    } else {
      const err = await res.json()
      alert(err.error || "Gagal tambah session")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <input
        type="datetime-local"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Fee"
        value={fee}
        onChange={e => setFee(e.target.value)}
        required
        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Tambah Sesi"}
      </button>
    </form>
  )
}
