import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { watchlist } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const coins = await db
      .select()
      .from(watchlist)
      .where(eq(watchlist.userId, session.user.id))

    return NextResponse.json(coins)
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { coinId, coinSymbol, coinName } = body

    if (!coinId || !coinSymbol) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if already in watchlist
    const existing = await db
      .select()
      .from(watchlist)
      .where(and(eq(watchlist.userId, session.user.id), eq(watchlist.coinId, coinId)))

    if (existing.length > 0) {
      return NextResponse.json({ error: "Coin already in watchlist" }, { status: 400 })
    }

    const [coin] = await db
      .insert(watchlist)
      .values({
        userId: session.user.id,
        coinId,
        coinSymbol,
        coinName,
      })
      .returning()

    return NextResponse.json(coin)
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get("coinId")

    if (!coinId) {
      return NextResponse.json({ error: "Missing coinId" }, { status: 400 })
    }

    await db
      .delete(watchlist)
      .where(and(eq(watchlist.userId, session.user.id), eq(watchlist.coinId, coinId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
