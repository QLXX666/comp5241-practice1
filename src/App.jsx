import { useState } from 'react'
import { Menu, Search, Sparkles } from 'lucide-react'
import Sidebar from './components/Sidebar'
import CourseCard from './components/CourseCard'
import StatsRow from './components/StatsRow'
import GenerateCourseDialog from './components/GenerateCourseDialog'
import { initialCourses, views } from './data/courses'

export default function App() {
  const [activeView, setActiveView] = useState('student')
  const [courses, setCourses] = useState(initialCourses)
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const view = views[activeView]
  const visibleCourses = courses
    .filter((c) => activeView !== 'student' || c.status === '已发布')
    .filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-900">
      <Sidebar
        activeView={activeView}
        onChange={setActiveView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-stone-200 bg-white/90 px-4 backdrop-blur sm:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-stone-600 hover:bg-stone-100 lg:hidden"
            aria-label="打开侧边栏"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative w-full max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
            <label htmlFor="search" className="sr-only">
              搜索课程
            </label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索迷你课程…"
              className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-stone-500 sm:inline">{view.label}</span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white"
              aria-label="当前用户"
            >
              LX
            </span>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{view.title}</h1>
              <p className="mt-1 text-sm text-stone-500">{view.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Generate New Course with AI
            </button>
          </section>

          <StatsRow courses={courses} view={activeView} />

          <section aria-labelledby="courses-heading" className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <h2 id="courses-heading" className="text-lg font-semibold">
                Mini-courses
              </h2>
              <span className="text-sm text-stone-500">共 {visibleCourses.length} 门</span>
            </div>

            {visibleCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleCourses.map((course) => (
                  <CourseCard key={course.id} course={course} view={activeView} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
                <p className="text-sm text-stone-500">没有找到匹配的课程。试试用 AI 生成一门新课程吧。</p>
              </div>
            )}
          </section>
        </main>
      </div>

      <GenerateCourseDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={(course) => {
          setCourses((prev) => [course, ...prev])
          if (activeView === 'student') setActiveView('instructor')
        }}
      />
    </div>
  )
}
