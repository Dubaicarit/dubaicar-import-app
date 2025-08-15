import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const one = await prisma.$queryRawUnsafe('select 1 as ok')
    return NextResponse.json({ db: 'ok', one })
  } catch (e: any) {
    return NextResponse.json({ db: 'error', message: e?.message || String(e) }, { status: 500 })
  }
}

