import { GraduationCap, Presentation, ShieldCheck, Sparkles, X } from 'lucide-react'
import { views } from '../data/courses'

const icons = {
  student: GraduationCap,
  instructor: Presentation,
  admin: ShieldCheck,
}

export default function Sidebar({ activeView, onChange, open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-stone-900/40 lg:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-stone-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-stone-200 px-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-stone-900">LearnGen</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-stone-500 hover:bg-stone-100 lg:hidden"
            aria-label="关闭侧边栏"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4" aria-label="视图切换">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-stone-400">视图</p>
          <ul className="flex flex-col gap-1">
            {Object.entries(views).map(([key, view]) => {
              const Icon = icons[key]
              const active = key === activeView
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(key)
                      onClose()
                    }}
                    aria-current={active ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {view.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="m-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-sm font-medium text-stone-900">AI 课程生成</p>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">
            输入主题，几秒内生成包含模块大纲与练习的迷你课程。
          </p>
        </div>
      </aside>
    </>
  )
}
