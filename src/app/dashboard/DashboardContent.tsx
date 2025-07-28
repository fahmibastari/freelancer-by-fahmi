'use client'

import { useEffect, useState } from "react"
import CompanyForm from "./CompanyForm"
import type { CompanyWithSessions } from "@/lib/types"
import AddSessionForm from "./AddSessionForm"
import CompanyActions from "./CompanyActions"
import EditSessionForm from "./EditSessionForm"
import { signOut } from "next-auth/react"
import { Calendar, Coins, Check, X, Edit, Trash } from "lucide-react"

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
    <main className="p-6 max-w-4xl mx-auto space-y-6 bg-black min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">FREELANCER</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
      <CompanyForm onAdded={handleCompanyAdded} />
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">LIST PERUSAHAAN & SESI</h2>

        {companies.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada perusahaan yang dicatat.</p>
        ) : (
          <ul className="space-y-4">
            {companies.map(company => (
              <li
                key={company.id}
                className="bg-neutral-900 border border-neutral-800 shadow-md rounded-xl p-4 space-y-2"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-white">
                      {company.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {company.address || "Alamat tidak tersedia"}
                    </p>
                    <span className="text-sm text-blue-500 font-medium">
                      {company.sessions?.length ?? 0} sesi
                    </span>

                    <ul className="text-sm text-gray-300 space-y-3 mt-4">
  {company.sessions.map(session => (
    <li
      key={session.id}
      className="flex justify-between items-start bg-neutral-800 p-4 rounded-lg border border-neutral-700"
    >
      {editingSessionId === session.id ? (
        <EditSessionForm
          session={{
            id: session.id,
            date: new Date(session.date).toISOString(),
            fee: session.fee,
            attended: session.attended,
          }}
          onUpdated={updated => handleSessionUpdated(company.id, updated)}
          onCancel={() => setEditingSessionId(null)}
        />
      ) : (
        <>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-medium">
              <Calendar size={16} />
              <span>
                {new Date(session.date).toLocaleString("id-ID", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Coins size={16} />
              <span>Rp{session.fee}</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {session.attended ? (
                <span className="flex items-center gap-1 text-green-400">
                  <Check size={14} /> Hadir
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400">
                  <X size={14} /> Tidak Hadir
                </span>
              )}
            </div>

            <button
  onClick={() => toggleAttendance({ ...session, companyId: company.id })}
  className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition 
    ${session.attended 
      ? "bg-neutral-700 text-gray-300 hover:bg-neutral-600"
      : "bg-blue-600 text-white hover:bg-blue-700"}`}
>
  {session.attended ? (
    <>
      <X size={14} /> Tandai Tidak Hadir
    </>
  ) : (
    <>
      <Check size={14} /> Tandai Hadir
    </>
  )}
</button>

          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleEditClick(session)}
              className="text-gray-300 hover:text-white transition"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDelete(session.id)}
              className="text-red-500 hover:text-red-600 transition"
              title="Hapus"
            >
              <Trash size={18} />
            </button>
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
    </main>
  )
}
