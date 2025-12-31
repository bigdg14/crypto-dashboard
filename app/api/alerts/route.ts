import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { alerts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userAlerts = await db
      .select()
      .from(alerts)
      .where(eq(alerts.userId, session.user.id))

    return NextResponse.json(userAlerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
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
    const { coinId, coinSymbol, targetPrice, condition } = body

    if (!coinId || !coinSymbol || !targetPrice || !condition) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (condition !== "above" && condition !== "below") {
      return NextResponse.json({ error: "Invalid condition" }, { status: 400 })
    }

    const [alert] = await db
      .insert(alerts)
      .values({
        userId: session.user.id,
        coinId,
        coinSymbol,
        targetPrice: targetPrice.toString(),
        condition,
      })
      .returning()

    return NextResponse.json(alert)
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
