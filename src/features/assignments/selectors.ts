import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { diffInDays } from '../../utils/date'
import {
  FILTER_STATUSES,
  PRIORITY_WEIGHT,
  type Assignment,
  type AssignmentView,
  type DeadlineStatus,
  type FilterStatus,
} from './types'

export const selectAssignmentItems = (state: RootState) => state.assignments.items
export const selectFilter = (state: RootState) => state.assignments.filter
export const selectStatus = (state: RootState) => state.assignments.status
export const selectError = (state: RootState) => state.assignments.error

/** Tham số thứ 2 của selector: ngày hôm nay (YYYY-MM-DD) */
const selectToday = (_: RootState, today: string) => today

const getDeadlineStatus = (a: Assignment, daysLeft: number): DeadlineStatus => {
  if (a.completed) return 'completed'
  return daysLeft < 0 ? 'overdue' : 'pending'
}

/** Chưa xong lên trước -> hạn gần trước -> ưu tiên cao trước */
const compareAssignments = (a: AssignmentView, b: AssignmentView): number =>
  Number(a.completed) - Number(b.completed) ||
  a.deadline.localeCompare(b.deadline) ||
  PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]

export const selectAssignmentViews = createSelector(
  [selectAssignmentItems, selectToday],
  (items, today): AssignmentView[] =>
    items
      .map((a) => {
        const daysLeft = diffInDays(a.deadline, today)
        return { ...a, daysLeft, deadlineStatus: getDeadlineStatus(a, daysLeft) }
      })
      .sort(compareAssignments),
)

export const selectFilteredAssignments = createSelector(
  [selectAssignmentViews, selectFilter],
  (views, filter) =>
    filter === 'all' ? views : views.filter((a) => a.deadlineStatus === filter),
)

/** Danh sách môn học (không trùng) để gợi ý khi nhập form */
export const selectSubjects = createSelector([selectAssignmentItems], (items) =>
  [...new Set(items.map((a) => a.subject))].sort((a, b) => a.localeCompare(b, 'vi')),
)

export const selectCounts = createSelector([selectAssignmentViews], (views) => {
  const counts = Object.fromEntries(FILTER_STATUSES.map((s) => [s, 0])) as Record<
    FilterStatus,
    number
  >
  counts.all = views.length
  views.forEach((a) => {
    counts[a.deadlineStatus] += 1
  })
  return counts
})
