/**
 * Các kiểu dùng chung toàn ứng dụng (Buổi 1 - TypeScript nâng cao).
 */

/** Generic: response chuẩn của API giả lập */
export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

/** Trạng thái của một tác vụ bất đồng bộ */
export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

/** Utility type: lỗi validate cho từng field của form (mọi field đều optional) */
export type FormErrors<T> = Partial<Record<keyof T, string>>

/** Utility type: biến mọi field của T thành string (dữ liệu thô từ input HTML) */
export type StringifyFields<T> = { [K in keyof T]: string }

/* ----------------------------- Type guards ----------------------------- */

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Generic type guard: kiểm tra value có thuộc một danh sách hằng (`as const`) hay không */
export const isOneOf = <const T extends readonly string[]>(
  list: T,
  value: unknown,
): value is T[number] => typeof value === 'string' && list.includes(value)

/** Kiểm tra chuỗi ngày dạng YYYY-MM-DD hợp lệ */
export const isISODateString = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(new Date(`${value}T00:00:00`).getTime())
