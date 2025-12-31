import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { portfolio } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db
      .delete(portfolio)
      .where(and(eq(portfolio.id, id), eq(portfolio.userId, session.user.id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting from portfolio:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
