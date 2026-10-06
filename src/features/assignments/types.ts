import {
  isBoolean,
  isISODateString,
  isNonEmptyString,
  isObject,
  isOneOf,
  type StringifyFields,
} from '../../types/common'

/* ------------------------------ Hằng số ------------------------------ */

export const PRIORITIES = ['high', 'medium', 'low'] as const
export type Priority = (typeof PRIORITIES)[number]

export const FILTER_STATUSES = ['all', 'pending', 'overdue', 'completed'] as const
export type FilterStatus = (typeof FILTER_STATUSES)[number]

/** Trạng thái thực tế của 1 bài tập = mọi filter trừ 'all' */
export type DeadlineStatus = Exclude<FilterStatus, 'all'>

/* ------------------------------ Entity ------------------------------ */

export interface Assignment {
  id: string
  subject: string
  title: string
  /** Hạn nộp, định dạng YYYY-MM-DD */
  deadline: string
  priority: Priority
  completed: boolean
  createdAt: string
}

/** Dữ liệu người dùng nhập khi tạo mới (bỏ các field hệ thống tự sinh) */
export type NewAssignmentInput = Omit<Assignment, 'id' | 'completed' | 'createdAt'>

/** Giá trị thô của form (tất cả là string) */
export type AssignmentFormValues = StringifyFields<NewAssignmentInput>

/** Bài tập kèm thông tin tính toán để hiển thị */
export interface AssignmentView extends Assignment {
  daysLeft: number
  deadlineStatus: DeadlineStatus
}

/* ------------------------------ Labels ------------------------------ */

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
}

/** Dùng để sắp xếp: số nhỏ = ưu tiên cao */
export const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export const FILTER_LABELS: Record<FilterStatus, string> = {
  all: 'Tất cả',
  pending: 'Chưa hoàn thành',
  overdue: 'Quá hạn',
  completed: 'Đã hoàn thành',
}

/* ---------------------------- Type guards ---------------------------- */

export const isPriority = (value: unknown): value is Priority => isOneOf(PRIORITIES, value)

export const isFilterStatus = (value: unknown): value is FilterStatus =>
  isOneOf(FILTER_STATUSES, value)

/** Kiểm tra dữ liệu không rõ kiểu (vd. từ API) có đúng là Assignment không */
export const isAssignment = (value: unknown): value is Assignment =>
  isObject(value) &&
  isNonEmptyString(value.id) &&
  isNonEmptyString(value.subject) &&
  isNonEmptyString(value.title) &&
  isISODateString(value.deadline) &&
  isPriority(value.priority) &&
  isBoolean(value.completed) &&
  typeof value.createdAt === 'string'
