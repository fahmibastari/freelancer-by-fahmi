'use client'

import { useEffect, useState } from "react"
import CompanyForm from "./CompanyForm"
import type { CompanyWithSessions } from "@/lib/types"
import AddSessionForm from "./AddSessionForm"
import CompanyActions from "./CompanyActions"
import EditSessionForm from "./EditSessionForm"

export default function DashboardContent() {
  const [companies, setCompanies] = useState<CompanyWithSessions[]>([])
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/company/list")
      .then(res => res.json())
      .then(data => {
        const safeData = data.map((c: any) => ({
          ...c,
          sessions: c.sessions ?? [],
        }))
        setCompanies(safeData)
      })
      .catch(err => console.error("Gagal fetch data:", err))
  }, [])

  const handleCompanyAdded = (newCompany: CompanyWithSessions) => {
    setCompanies(prev => [...prev, { ...newCompany, sessions: [] }])
  }

  const handleCompanyUpdated = (updated: CompanyWithSessions) => {
    setCompanies(prev => prev.map(c => (c.id === updated.id ? updated : c)))
  }

  const handleCompanyDeleted = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id))
  }

  const handleSessionAdded = (companyId: string, newSession: any) => {
    setCompanies(prev =>
      prev.map(company =>
        company.id === companyId
          ? { ...company, sessions: [...company.sessions, newSession] }
          : company
      )
    )
  }

  const toggleAttendance = async (session: { id: string; attended: boolean; companyId: string }) => {
    const res = await fetch(`/api/session/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attended: !session.attended }),
    })
  
    if (res.ok) {
      const updated = await res.json()
      setCompanies(prev =>
        prev.map(company =>
          company.id === session.companyId
            ? {
                ...company,
                sessions: company.sessions.map(s =>
                  s.id === session.id ? updated : s
                ),
              }
            : company
        )
      )
    } else {
      alert("Gagal mengubah status kehadiran.")
    }
  }
  

  const handleDelete = async (id: string) => {
    const ok = confirm("Yakin ingin menghapus sesi ini?")
    if (!ok) return
  
    const res = await fetch(`/api/session/${id}`, {
      method: "DELETE",
    })
  
    if (res.ok) {
      // Update state local: hapus dari UI
      setCompanies(prev =>
        prev.map(company => ({
          ...company,
          sessions: company.sessions.filter(session => session.id !== id)
        }))
      )
    } else {
      alert("Gagal hapus sesi")
    }
  }
  

  const handleEditClick = (session: { id: string }) => {
    setEditingSessionId(session.id)
  }

  const handleSessionUpdated = (companyId: string, updatedSession: any) => {
    setCompanies(prev =>
      prev.map(company =>
        company.id === companyId
          ? {
              ...company,
              sessions: company.sessions.map(s =>
                s.id === updatedSession.id ? updatedSession : s
              ),
            }
          : company
      )
    )
    setEditingSessionId(null)
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Freelancer</h1>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white-800 mb-4">
          Daftar Perusahaan
        </h2>

        {companies.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada perusahaan yang dicatat.</p>
        ) : (
          <ul className="space-y-3">
            {companies.map(company => (
              <li
                key={company.id}
                className="bg-white shadow-md rounded-xl p-4 space-y-2"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      {company.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {company.address || "Alamat tidak tersedia"}
                    </p>
                    <span className="text-sm text-blue-600 font-medium">
                      {company.sessions?.length ?? 0} sesi
                    </span>

                    {/* 🟦 Daftar sesi */}
                    <ul className="text-sm text-gray-700 space-y-1 mt-2">
                      {company.sessions.map(session => (
                        <li
                          key={session.id}
                          className="flex justify-between items-center bg-gray-50 p-2 rounded"
                        >
                          {editingSessionId === session.id ? (
                            <EditSessionForm
                            session={{
                              id: session.id,
                              date: new Date(session.date).toISOString(), // ✅ konversi ke string
                              fee: session.fee,
                              attended: session.attended,
                            }}
                            onUpdated={updated => handleSessionUpdated(company.id, updated)}
                            onCancel={() => setEditingSessionId(null)}
                          />
                          
                          ) : (
                            <>
                              <div>
                              <p>{new Date(session.date).toLocaleString("id-ID", {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
})}</p>

                                <p className="text-sm text-gray-500">Rp{session.fee}</p>
                                <p className="text-xs text-gray-400">
  {session.attended ? "✅ Hadir" : "❌ Tidak hadir"}
</p>

<button
  onClick={() => toggleAttendance({ ...session, companyId: company.id })}
  className="text-xs text-blue-500 underline"
>
  {session.attended ? "Tandai Tidak Hadir" : "Tandai Hadir"}
</button>

                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEditClick(session)}>✏️</button>
                                <button onClick={() => handleDelete(session.id)}>🗑️</button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <CompanyActions
                    company={company}
                    onUpdated={handleCompanyUpdated}
                    onDeleted={handleCompanyDeleted}
                  />
                </div>

                <AddSessionForm
                  companyId={company.id}
                  onAdded={newSession => handleSessionAdded(company.id, newSession)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <CompanyForm onAdded={handleCompanyAdded} />
    </main>
  )
}
