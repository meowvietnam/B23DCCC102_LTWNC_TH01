const MS_PER_DAY = 24 * 60 * 60 * 1000

const pad = (n: number) => String(n).padStart(2, '0')

/** Date -> 'YYYY-MM-DD' theo giờ địa phương */
export const toISODate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** 'YYYY-MM-DD' -> Date lúc 00:00 giờ địa phương */
export const parseISODate = (iso: string): Date => new Date(`${iso}T00:00:00`)

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/** Số ngày từ `from` đến `to` (cả hai dạng YYYY-MM-DD). Âm nếu `to` ở quá khứ. */
export const diffInDays = (to: string, from: string): number =>
  Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / MS_PER_DAY)

/** 'YYYY-MM-DD' -> 'dd/mm/yyyy' */
export const formatDate = (iso: string): string =>
  parseISODate(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

/** "Còn X ngày" / "Hết hạn hôm nay" / "Quá hạn Y ngày" */
export const getDeadlineLabel = (daysLeft: number): string => {
  if (daysLeft > 0) return `Còn ${daysLeft} ngày`
  if (daysLeft === 0) return 'Hết hạn hôm nay'
  return `Quá hạn ${Math.abs(daysLeft)} ngày`
}
