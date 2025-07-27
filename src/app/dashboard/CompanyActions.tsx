'use client'
import { useState } from "react"
import EditCompanyForm from "./EditCompanyForm"

export default function CompanyActions({ company, onUpdated, onDeleted }: {
  company: any,
  onUpdated: (updated: any) => void,
  onDeleted: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = async () => {
    const ok = confirm("Yakin ingin hapus perusahaan ini?")
    if (!ok) return

    const res = await fetch(`/api/company/${company.id}`, {
      method: "DELETE"
    })

    if (res.ok) {
      onDeleted(company.id)
    } else {
      const err = await res.json()
      alert(err.error || "Gagal hapus")
    }
  }

  return (
    <div className="space-x-2">
      <button onClick={() => setIsEditing(true)} className="text-blue-500">Edit</button>
      <button onClick={handleDelete} className="text-red-500">Hapus</button>

      {isEditing && (
        <EditCompanyForm
          company={company}
          onClose={() => setIsEditing(false)}
          onUpdated={onUpdated}
        />
      )}
    </div>
  )
}
