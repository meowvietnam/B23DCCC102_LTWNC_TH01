import { Inbox, LoaderCircle, RefreshCw, TriangleAlert } from 'lucide-react'
import type { AssignmentView } from '../types'
import { AssignmentItem } from './AssignmentItem'

interface Props {
  items: AssignmentView[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function AssignmentList({ items, isLoading, error, onRetry, onToggle, onDelete }: Props) {
  if (isLoading && items.length === 0) {
    return (
      <div className="state">
        <LoaderCircle className="spin" size={28} />
        <p>Đang tải danh sách bài tập...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state state--error">
        <TriangleAlert size={28} />
        <p>{error}</p>
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          <RefreshCw size={16} /> Thử lại
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="state">
        <Inbox size={28} />
        <p>Không có bài tập nào ở mục này.</p>
      </div>
    )
  }

  return (
    <ul className="list">
      {items.map((a) => (
        <AssignmentItem key={a.id} assignment={a} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
