import Tabs from '../../../components/Tabs'
import { FILTER_LABELS, FILTER_STATUSES, type FilterStatus } from '../types'

const TONES = {
  all: 'default',
  pending: 'warning',
  overdue: 'danger',
  completed: 'success',
} as const satisfies Record<FilterStatus, 'default' | 'warning' | 'danger' | 'success'>

interface Props {
  value: FilterStatus
  counts: Record<FilterStatus, number>
  onChange: (value: FilterStatus) => void
}

export function AssignmentFilter({ value, counts, onChange }: Props) {
  return (
    <Tabs value={value} onChange={onChange} aria-label="Lọc theo trạng thái">
      {FILTER_STATUSES.map((status) => (
        <Tabs.Tab key={status} value={status} badge={counts[status]} tone={TONES[status]}>
          {FILTER_LABELS[status]}
        </Tabs.Tab>
      ))}
    </Tabs>
  )
}
