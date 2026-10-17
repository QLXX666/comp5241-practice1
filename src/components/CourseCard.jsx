import { BookOpen, Clock, Sparkles, Users } from 'lucide-react'

export default function CourseCard({ course, view }) {
  const isDraft = course.status === '草稿'

  return (
    <article className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
            {course.level}
          </span>
          {course.aiGenerated && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              AI 生成
            </span>
          )}
        </div>
        {view !== 'student' && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isDraft ? 'bg-amber-50 text-amber-800' : 'bg-stone-900 text-white'
            }`}
          >
            {course.status}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-pretty text-lg font-semibold leading-snug text-stone-900">{course.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">{course.description}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="标签">
        {course.tags.map((tag) => (
          <li key={tag} className="rounded border border-stone-200 px-1.5 py-0.5 text-xs text-stone-500">
            {tag}
          </li>
        ))}
      </ul>

      <dl className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500">
        <div className="flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="sr-only">模块数</dt>
          <dd>{course.modules} 个模块</dd>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="sr-only">时长</dt>
          <dd>{course.duration}</dd>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="sr-only">学员</dt>
          <dd>{course.enrolled} 名学员</dd>
        </div>
      </dl>

      <div className="mt-auto pt-5">
        {view === 'student' ? (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">学习进度</span>
              <span className="font-medium text-stone-900">{course.progress}%</span>
            </div>
            <div
              className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100"
              role="progressbar"
              aria-valuenow={course.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${course.title} 学习进度`}
            >
              <div className="h-full rounded-full bg-emerald-600" style={{ width: `${course.progress}%` }} />
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-900 hover:bg-stone-50"
            >
              {course.progress === 0 ? '开始学习' : course.progress === 100 ? '复习课程' : '继续学习'}
            </button>
          </>
        ) : (
          <div className="flex gap-2 border-t border-stone-100 pt-4">
            <button
              type="button"
              className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-900 hover:bg-stone-50"
            >
              {view === 'admin' ? '审核' : '编辑'}
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
            >
              查看数据
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
