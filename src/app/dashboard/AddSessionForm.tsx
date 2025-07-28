import { useState } from "react"

export default function AddSessionForm({
  companyId,
  onAdded,
}: {
  companyId: string
  onAdded?: (session: any) => void // ✅ ubah ke session
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
        date: new Date(date).toISOString(), // ubah ke ISO format
        fee: parseFloat(fee),
        companyId,
      }),      
    })

    setLoading(false)
    if (res.ok) {
      const newSession = await res.json() // ✅ tangkap session dari response
      onAdded?.(newSession) // ✅ langsung update state parent
      setDate("")
      setFee("")
    } else {
      const err = await res.json()
      alert(err.error || "Gagal tambah session")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <input
  type="datetime-local"
  value={date}
  onChange={e => setDate(e.target.value)}
  required
  className="border px-2 py-1 rounded w-full"
/>
      <input
        type="number"
        placeholder="Fee"
        value={fee}
        onChange={e => setFee(e.target.value)}
        required
        className="border px-2 py-1 rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Menyimpan..." : "Tambah Sesi"}
      </button>
    </form>
  )
}
