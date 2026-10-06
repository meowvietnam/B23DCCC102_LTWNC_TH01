import { Plus } from 'lucide-react'
import { useForm } from '../../../hooks/useForm'
import { isISODateString, isNonEmptyString, type FormErrors } from '../../../types/common'
import {
  PRIORITIES,
  PRIORITY_LABELS,
  isPriority,
  type AssignmentFormValues,
  type NewAssignmentInput,
} from '../types'

const INITIAL_VALUES: AssignmentFormValues = {
  subject: '',
  title: '',
  deadline: '',
  priority: 'medium',
}

const validate = (v: AssignmentFormValues): FormErrors<AssignmentFormValues> => {
  const errors: FormErrors<AssignmentFormValues> = {}
  if (!isNonEmptyString(v.subject)) errors.subject = 'Vui lòng nhập môn học'
  else if (v.subject.trim().length > 60) errors.subject = 'Tối đa 60 ký tự'
  if (!isNonEmptyString(v.title)) errors.title = 'Vui lòng nhập tên bài tập'
  else if (v.title.trim().length > 120) errors.title = 'Tối đa 120 ký tự'
  if (!isISODateString(v.deadline)) errors.deadline = 'Vui lòng chọn hạn nộp hợp lệ'
  if (!isPriority(v.priority)) errors.priority = 'Độ ưu tiên không hợp lệ'
  return errors
}

/** Chuyển giá trị thô (string) của form sang dữ liệu đúng kiểu nhờ type guard */
const toAssignmentInput = (v: AssignmentFormValues): NewAssignmentInput | null =>
  isPriority(v.priority)
    ? { subject: v.subject.trim(), title: v.title.trim(), deadline: v.deadline, priority: v.priority }
    : null

interface Props {
  onAdd: (input: NewAssignmentInput) => void
  subjectSuggestions?: string[]
}

export function AssignmentForm({ onAdd, subjectSuggestions = [] }: Props) {
  const { register, getError, handleSubmit } = useForm<AssignmentFormValues>({
    initialValues: INITIAL_VALUES,
    validate,
    onSubmit: (values) => {
      const input = toAssignmentInput(values)
      if (!input) return false
      onAdd(input)
    },
  })

  const subjectError = getError('subject')
  const titleError = getError('title')
  const deadlineError = getError('deadline')
  const priorityError = getError('priority')

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">Thêm bài tập mới</h2>

      <div className="field">
        <label htmlFor="subject">Môn học</label>
        <input
          {...register('subject')}
          placeholder="VD: Lập trình Web nâng cao"
          list="subject-suggestions"
          autoComplete="off"
        />
        <datalist id="subject-suggestions">
          {subjectSuggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        {subjectError && <span className="field__error">{subjectError}</span>}
      </div>

      <div className="field">
        <label htmlFor="title">Tên bài tập</label>
        <input {...register('title')} placeholder="VD: Bài thực hành 01" autoComplete="off" />
        {titleError && <span className="field__error">{titleError}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="deadline">Hạn nộp</label>
          <input {...register('deadline')} type="date" />
          {deadlineError && <span className="field__error">{deadlineError}</span>}
        </div>

        <div className="field">
          <label htmlFor="priority">Độ ưu tiên</label>
          <select {...register('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
          {priorityError && <span className="field__error">{priorityError}</span>}
        </div>
      </div>

      <button type="submit" className="btn btn--primary">
        <Plus size={18} /> Thêm bài tập
      </button>
    </form>
  )
}
