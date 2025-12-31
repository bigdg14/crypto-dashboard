import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { portfolio } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const holdings = await db
      .select()
      .from(portfolio)
      .where(eq(portfolio.userId, session.user.id))

    return NextResponse.json(holdings)
  } catch (error) {
    console.error("Error fetching portfolio:", error)
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
    const { coinId, coinSymbol, coinName, amount, purchasePrice, purchaseDate } = body

    if (!coinId || !coinSymbol || !amount || !purchasePrice || !purchaseDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const [holding] = await db
      .insert(portfolio)
      .values({
        userId: session.user.id,
        coinId,
        coinSymbol,
        coinName,
        amount: amount.toString(),
        purchasePrice: purchasePrice.toString(),
        purchaseDate: new Date(purchaseDate),
      })
      .returning()

    return NextResponse.json(holding)
  } catch (error) {
    console.error("Error adding to portfolio:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
