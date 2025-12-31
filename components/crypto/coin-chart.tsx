"use client"

import { useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { format } from "date-fns"
import { Card } from "../ui/card"

interface CoinChartProps {
  data: {
    prices: [number, number][]
    total_volumes?: [number, number][]
  }
  showVolume?: boolean
  timeframe?: string
}

export function CoinChart({ data, showVolume = true, timeframe = "7d" }: CoinChartProps) {
  const chartData = useMemo(() => {
    return data.prices.map(([timestamp, price], index) => ({
      timestamp,
      price,
      volume: data.total_volumes?.[index]?.[1] || 0,
      date: new Date(timestamp),
    }))
  }, [data])

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp)
    // Handle different timeframe formats
    if (timeframe === "1") {
      return format(date, "HH:mm")
    } else if (timeframe === "7" || timeframe === "30") {
      return format(date, "MMM dd")
    } else if (timeframe === "365") {
      return format(date, "MMM yyyy")
    } else if (timeframe === "max") {
      return format(date, "yyyy")
    } else {
      return format(date, "MMM dd")
    }
  }

  const formatTooltipDate = (timestamp: number) => {
    return format(new Date(timestamp), "PPpp")
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelFormatter={formatTooltipDate}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {showVolume && (
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4">Volume</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                labelFormatter={formatTooltipDate}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Volume"]}
              />
              <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
