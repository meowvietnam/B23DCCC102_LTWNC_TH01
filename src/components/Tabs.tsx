import { createContext, useContext, type ReactNode } from 'react'

/**
 * Compound Component: <Tabs> + <Tabs.Tab>
 * Tabs giữ state (giá trị đang chọn) và chia sẻ qua Context,
 * các Tabs.Tab con tự đọc context để biết mình có đang active hay không.
 *
 * @example
 * <Tabs value={filter} onChange={setFilter}>
 *   <Tabs.Tab value="all">Tất cả</Tabs.Tab>
 *   <Tabs.Tab value="done" badge={3}>Đã xong</Tabs.Tab>
 * </Tabs>
 */

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('<Tabs.Tab> phải được đặt bên trong <Tabs>')
  return ctx
}

interface TabsProps<T extends string> {
  value: T
  onChange: (value: T) => void
  children: ReactNode
  'aria-label'?: string
}

function Tabs<T extends string>({ value, onChange, children, ...rest }: TabsProps<T>) {
  return (
    <TabsContext.Provider value={{ value, onChange: onChange as (value: string) => void }}>
      <div className="tabs" role="tablist" aria-label={rest['aria-label']}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabProps {
  value: string
  children: ReactNode
  badge?: ReactNode
  /** Màu nhấn của tab (map sang class CSS) */
  tone?: 'default' | 'warning' | 'danger' | 'success'
}

function Tab({ value, children, badge, tone = 'default' }: TabProps) {
  const { value: selected, onChange } = useTabsContext()
  const isActive = selected === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`tabs__tab tabs__tab--${tone}${isActive ? ' is-active' : ''}`}
      onClick={() => onChange(value)}
    >
      <span>{children}</span>
      {badge !== undefined && <span className="tabs__badge">{badge}</span>}
    </button>
  )
}

Tabs.Tab = Tab

export default Tabs
