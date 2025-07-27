// src/lib/types.ts
import type { Company, Session } from "@prisma/client"

export type CompanyWithSessions = Company & {
  sessions: Session[]
}
