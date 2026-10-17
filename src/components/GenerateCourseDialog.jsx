import { useEffect, useRef, useState } from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'

const levels = ['入门', '中级', '进阶']

export default function GenerateCourseDialog({ open, onClose, onCreate }) {
  const dialogRef = useRef(null)
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('入门')
  const [modules, setModules] = useState(5)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = topic.trim()
    if (!trimmed || generating) return
    setGenerating(true)
    setTimeout(() => {
      onCreate({
        id: `ai-${Date.now()}`,
        title: trimmed,
        description: `由 AI 根据主题「${trimmed}」自动生成的迷你课程，包含 ${modules} 个模块的大纲、讲解与练习。`,
        level,
        modules,
        duration: `${Math.max(1, Math.round(modules * 0.6))} 小时`,
        enrolled: 0,
        progress: 0,
        status: '草稿',
        tags: ['AI 大纲', level],
        aiGenerated: true,
      })
      setGenerating(false)
      setTopic('')
      setModules(5)
      setLevel('入门')
      onClose()
    }, 1400)
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && !generating && onClose()}
      aria-labelledby="generate-title"
      className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-stone-200 bg-white p-0 text-stone-900 shadow-xl backdrop:bg-stone-900/40"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="generate-title" className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              Generate New Course with AI
            </h2>
            <p className="mt-1 text-sm text-stone-500">描述你想教授的主题，AI 会为你生成课程草稿。</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={generating}
            className="rounded-md p-1 text-stone-500 hover:bg-stone-100 disabled:opacity-50"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="topic" className="text-sm font-medium">
            课程主题
          </label>
          <input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：Introduction to Machine Learning"
            required
            autoFocus
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="level" className="text-sm font-medium">
              难度
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            >
              {levels.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="modules" className="text-sm font-medium">
              模块数量
            </label>
            <input
              id="modules"
              type="number"
              min={2}
              max={12}
              value={modules}
              onChange={(e) => setModules(Number(e.target.value))}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={generating}
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 disabled:opacity-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={generating || !topic.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                生成中…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                生成课程
              </>
            )}
          </button>
        </div>
      </form>
    </dialog>
  )
}
