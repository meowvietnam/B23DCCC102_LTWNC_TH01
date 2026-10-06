import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { useToday } from '../../../hooks/useToday'
import {
  addAssignment,
  deleteAssignment,
  fetchAssignments,
  setFilter,
  toggleAssignment,
} from '../assignmentsSlice'
import {
  selectCounts,
  selectError,
  selectFilter,
  selectFilteredAssignments,
  selectStatus,
  selectSubjects,
} from '../selectors'
import type { FilterStatus, NewAssignmentInput } from '../types'

/**
 * Custom hook "facade" cho feature assignments:
 * gom state + actions từ Redux, tự fetch dữ liệu ban đầu,
 * để component UI không cần biết tới Redux.
 */
export function useAssignments() {
  const dispatch = useAppDispatch()
  const today = useToday()

  const items = useAppSelector((state) => selectFilteredAssignments(state, today))
  const counts = useAppSelector((state) => selectCounts(state, today))
  const filter = useAppSelector(selectFilter)
  const status = useAppSelector(selectStatus)
  const error = useAppSelector(selectError)
  const subjects = useAppSelector(selectSubjects)

  useEffect(() => {
    void dispatch(fetchAssignments())
  }, [dispatch])

  const add = useCallback((input: NewAssignmentInput) => dispatch(addAssignment(input)), [dispatch])
  const toggle = useCallback((id: string) => dispatch(toggleAssignment(id)), [dispatch])
  const remove = useCallback((id: string) => dispatch(deleteAssignment(id)), [dispatch])
  const changeFilter = useCallback((f: FilterStatus) => dispatch(setFilter(f)), [dispatch])
  const retry = useCallback(() => void dispatch(fetchAssignments()), [dispatch])

  return {
    items,
    counts,
    filter,
    subjects,
    today,
    isLoading: status === 'loading',
    error: status === 'failed' ? error : null,
    add,
    toggle,
    remove,
    changeFilter,
    retry,
  }
}
