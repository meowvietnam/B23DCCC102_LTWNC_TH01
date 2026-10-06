import { CalendarClock } from 'lucide-react'
import './App.css'
import { AssignmentFilter } from './features/assignments/components/AssignmentFilter'
import { AssignmentForm } from './features/assignments/components/AssignmentForm'
import { AssignmentList } from './features/assignments/components/AssignmentList'
import { useAssignments } from './features/assignments/hooks/useAssignments'
import { formatDate } from './utils/date'

function App() {
  const {
    items,
    counts,
    filter,
    subjects,
    today,
    isLoading,
    error,
    add,
    toggle,
    remove,
    changeFilter,
    retry,
  } = useAssignments()

  const progress = counts.all === 0 ? 0 : Math.round((counts.completed / counts.all) * 100)

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <div className="header__logo">
            <CalendarClock size={26} />
          </div>
          <div>
            <h1>Student Deadline Tracker</h1>
            <p>Quản lý deadline bài tập cá nhân · Hôm nay {formatDate(today)}</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat__value">{counts.pending}</span>
            <span className="stat__label">Đang chờ</span>
          </div>
          <div className="stat stat--danger">
            <span className="stat__value">{counts.overdue}</span>
            <span className="stat__label">Quá hạn</span>
          </div>
          <div className="stat stat--success">
            <span className="stat__value">{progress}%</span>
            <span className="stat__label">Hoàn thành</span>
          </div>
        </div>
      </header>

      <main className="layout">
        <aside>
          <AssignmentForm onAdd={add} subjectSuggestions={subjects} />
        </aside>

        <section className="card">
          <div className="section-head">
            <h2 className="card__title">Danh sách bài tập</h2>
            <div className="progress" aria-label={`Đã hoàn thành ${progress}%`}>
              <div className="progress__bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <AssignmentFilter value={filter} counts={counts} onChange={changeFilter} />
          <AssignmentList
            items={items}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            onToggle={toggle}
            onDelete={remove}
          />
        </section>
      </main>

      <footer className="footer">B23DCCC102 · LTWNC - Bài thực hành 01</footer>
    </div>
  )
}

export default App
