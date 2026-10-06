import { useEffect, useState } from 'react'
import { toISODate } from '../utils/date'

/**
 * Trả về ngày hôm nay (YYYY-MM-DD) và tự cập nhật khi qua nửa đêm,
 * giúp "Còn X ngày" luôn chính xác kể cả khi để app mở qua đêm.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => toISODate(new Date()))

  useEffect(() => {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const timer = setTimeout(() => setToday(toISODate(new Date())), nextMidnight.getTime() - now.getTime() + 1000)
    return () => clearTimeout(timer)
  }, [today])

  return today
}
