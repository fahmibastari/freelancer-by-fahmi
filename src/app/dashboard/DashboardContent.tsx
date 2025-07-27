'use client'

import { useEffect, useState } from "react"
import CompanyForm from "./CompanyForm"
import type { CompanyWithSessions } from "@/lib/types"
import AddSessionForm from "./AddSessionForm"
import CompanyActions from "./CompanyActions"


export default function DashboardContent() {
    const [companies, setCompanies] = useState<CompanyWithSessions[]>([])
  
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
      setCompanies(prev =>
        prev.map(c => (c.id === updated.id ? updated : c))
      )
    }
    
    const handleCompanyDeleted = (id: string) => {
      setCompanies(prev => prev.filter(c => c.id !== id))
    }
    

    const handleSessionAdded = (companyId: string, newSession: any) => {
      setCompanies(prev =>
        prev.map(company =>
          company.id === companyId
            ? {
                ...company,
                sessions: [...company.sessions, newSession],
              }
            : company
        )
      )
    }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Freelancer</h1>

      <section className="mt-8">
  <h2 className="text-2xl font-bold text-white-800 mb-4">Daftar Perusahaan</h2>

  {companies.length === 0 ? (
    <p className="text-gray-500 italic">Belum ada perusahaan yang dicatat.</p>
  ) : (
    <ul className="space-y-3">
  {companies.map((company: CompanyWithSessions) => (
    <li
      key={company.id}
      className="bg-white shadow-md rounded-xl p-4 space-y-2"
    >
      <div className="flex justify-between items-start gap-4">
  <div>
    <p className="text-lg font-semibold text-gray-700">{company.name}</p>
    <p className="text-sm text-gray-500">{company.address || "Alamat tidak tersedia"}</p>
    <span className="text-sm text-blue-600 font-medium">
  {company.sessions?.length ?? 0} sesi
</span>

  </div>

  {/* ✅ Tambahkan ini */}
  <CompanyActions
    company={company}
    onUpdated={handleCompanyUpdated}
    onDeleted={handleCompanyDeleted}
  />
</div>


      {/* ✅ Tambah form tambah sesi per perusahaan */}
      <AddSessionForm
        companyId={company.id}
        onAdded={(newSession) =>
          handleSessionAdded(company.id, newSession)
        }
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
