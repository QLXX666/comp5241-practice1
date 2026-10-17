export default function StatsRow({ courses, view }) {
  const published = courses.filter((c) => c.status === '已发布').length
  const totalLearners = courses.reduce((sum, c) => sum + c.enrolled, 0)
  const aiCount = courses.filter((c) => c.aiGenerated).length
  const inProgress = courses.filter((c) => c.progress > 0 && c.progress < 100).length
  const completed = courses.filter((c) => c.progress === 100).length

  const stats = {
    student: [
      { label: '进行中', value: inProgress },
      { label: '已完成', value: completed },
      { label: '可学课程', value: published },
    ],
    instructor: [
      { label: '我的课程', value: courses.length },
      { label: '已发布', value: published },
      { label: '学员总数', value: totalLearners.toLocaleString() },
    ],
    admin: [
      { label: '课程总数', value: courses.length },
      { label: 'AI 生成课程', value: aiCount },
      { label: '活跃学员', value: totalLearners.toLocaleString() },
    ],
  }[view]

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-stone-200 bg-white px-5 py-4">
          <dt className="text-sm text-stone-500">{stat.label}</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-stone-900">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}
