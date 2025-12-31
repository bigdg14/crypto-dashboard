"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface SparklineChartProps {
  data: number[]
  color?: string
}

export function SparklineChart({ data, color }: SparklineChartProps) {
  const chartData = data.map((value, index) => ({
    value,
    index,
  }))

  // Determine if trend is positive or negative
  const isPositive = data[data.length - 1] >= data[0]
  const lineColor = color || (isPositive ? "#10b981" : "#ef4444")

  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={lineColor}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
