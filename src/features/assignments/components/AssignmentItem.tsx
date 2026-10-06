import { CalendarDays, Check, Trash2 } from 'lucide-react'
import { memo } from 'react'
import { formatDate, getDeadlineLabel } from '../../../utils/date'
import { PRIORITY_LABELS, type AssignmentView } from '../types'

interface Props {
  assignment: AssignmentView
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function AssignmentItemBase({ assignment: a, onToggle, onDelete }: Props) {
  const handleDelete = () => {
    if (window.confirm(`Xoá bài tập "${a.title}"?`)) onDelete(a.id)
  }

  return (
    <li className={`item item--${a.deadlineStatus}`}>
      <button
        type="button"
        className={`item__check${a.completed ? ' is-checked' : ''}`}
        onClick={() => onToggle(a.id)}
        aria-label={a.completed ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu hoàn thành'}
        title={a.completed ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu hoàn thành'}
      >
        {a.completed && <Check size={16} strokeWidth={3} />}
      </button>

      <div className="item__body">
        <div className="item__meta">
          <span className="chip chip--subject">{a.subject}</span>
          <span className={`chip chip--${a.priority}`}>Ưu tiên: {PRIORITY_LABELS[a.priority]}</span>
        </div>
        <h3 className="item__title">{a.title}</h3>
        <div className="item__deadline">
          <span className="item__date">
            <CalendarDays size={14} /> {formatDate(a.deadline)}
          </span>
          <span className={`countdown countdown--${a.deadlineStatus}`}>
            {getDeadlineLabel(a.daysLeft)}
          </span>
          {a.completed && <span className="countdown countdown--completed">✓ Đã hoàn thành</span>}
        </div>
      </div>

      <button
        type="button"
        className="btn btn--icon btn--danger"
        onClick={handleDelete}
        aria-label="Xoá bài tập"
        title="Xoá bài tập"
      >
        <Trash2 size={18} />
      </button>
    </li>
  )
}

export const AssignmentItem = memo(AssignmentItemBase)
