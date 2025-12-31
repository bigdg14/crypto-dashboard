import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PriceChangeProps {
  value: number
  className?: string
  showIcon?: boolean
}

export function PriceChange({ value, className, showIcon = true }: PriceChangeProps) {
  const isPositive = value >= 0

  return (
    <div
      className={cn(
        "flex items-center gap-1 font-medium",
        isPositive ? "text-green-500" : "text-red-500",
        className
      )}
    >
      {showIcon && (
        <>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </>
      )}
      <span>
        {isPositive ? "+" : ""}
        {value.toFixed(2)}%
      </span>
    </div>
  )
}
