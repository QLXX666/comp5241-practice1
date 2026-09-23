import { useEffect, useState } from "react";

const STORAGE_KEY = "scoreboard-data-v1";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { teams: [] };
}

export default function App() {
  const [teams, setTeams] = useState(() => loadData().teams);
  const [view, setView] = useState("control");

  // 保存数据到本地，刷新不丢失
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ teams }));
  }, [teams]);

  // 快捷键切换视图：Ctrl+1 控制台，Ctrl+2 展示模式
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "1") setView("control");
      if (e.ctrlKey && e.key === "2") setView("display");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // 添加队伍
  const addTeam = () => {
    const name = prompt("请输入队伍名称：");
    if (!name) return;
    setTeams([
      ...teams,
      {
        id: crypto.randomUUID(),
        name,
        round1: 0,
        round2: 0,
        history: [],
      },
    ]);
  };

  // 更新分数
  const updateScore = (id, round, value) => {
    const num = value === "" ? 0 : Number(value);
    if (isNaN(num)) return;
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const key = `round${round}`;
        const oldValue = t[key];
        const newTotal = round === 1 ? num + t.round2 : t.round1 + num;
        return {
          ...t,
          [key]: num,
          total: newTotal,
          history: [
            ...t.history,
            {
              time: new Date().toLocaleTimeString(),
              round,
              oldValue,
              newValue: num,
            },
          ],
        };
      })
    );
  };

  // 删除队伍
  const deleteTeam = (id) => {
    if (!confirm("确定要删除这支队伍吗？")) return;
    setTeams((prev) => prev.filter((t) => t.id !== id));
  };

  // 排序：按总分降序
  const sortedTeams = [...teams].sort((a, b) => {
    const ta = a.round1 + a.round2;
    const tb = b.round1 + b.round2;
    return tb - ta;
  });

  // ==================== 展示模式（直播画面） ====================
  if (view === "display") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-widest">
          🏆 排行榜 🏆
        </h1>

        {/* 4列网格布局，适合7支队伍（4+3排列） */}
        <div className="w-full max-w-7xl grid grid-cols-4 gap-6">
          {sortedTeams.length === 0 && (
            <p className="col-span-4 text-center text-gray-500 text-3xl mt-20">
              还没有队伍，请按 Ctrl+1 回到控制台添加
            </p>
          )}

          {sortedTeams.map((t, index) => {
            const total = t.round1 + t.round2;
            // 前三名特殊边框颜色
            const rankColors = [
              "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]",
              "border-gray-300 shadow-[0_0_20px_rgba(209,213,219,0.4)]",
              "border-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.4)]",
            ];
            const color = rankColors[index] || "border-cyan-500/40";
            return (
              <div
                key={t.id}
                className={`flex flex-col items-center justify-between bg-gray-900/80 border-2 ${color} rounded-2xl p-6 backdrop-blur-sm h-52`}
              >
                {/* 排名 */}
                <div className="text-2xl font-black text-gray-500 w-full text-left">
                  #{index + 1}
                </div>

                {/* 队名 */}
                <div className="text-2xl font-bold text-white text-center leading-tight my-2">
                  {t.name}
                </div>

                {/* 总分 */}
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {total}
                </div>

                {/* 各轮分数 */}
                <div className="text-xs text-gray-500 mt-2 bg-black/30 px-3 py-1 rounded-full">
                  第1轮 {t.round1} · 第2轮 {t.round2}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-gray-600 text-sm">
          按 Ctrl+1 回到控制台 · Ctrl+2 返回展示
        </div>
      </div>
    );
  }

  // ==================== 控制台模式（你操作） ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            🎮 比分控制台
          </h1>
          <div className="flex gap-4">
            <button
              onClick={addTeam}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            >
              + 添加队伍
            </button>
            <button
              onClick={() => setView("display")}
              className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold transition shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            >
              展示模式
            </button>
          </div>
        </div>

        {teams.length === 0 ? (
          <p className="text-center text-gray-500 text-xl mt-20">
            还没有队伍，点击右上角「+ 添加队伍」开始
          </p>
        ) : (
          /* 响应式网格布局：手机1列，平板2列，电脑3列，大屏4列 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teams.map((t) => {
              const total = t.round1 + t.round2;
              return (
                <div
                  key={t.id}
                  className="bg-gray-900/80 border border-cyan-500/30 rounded-2xl p-5 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-cyan-400 truncate max-w-[120px]">
                      {t.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">总分:</span>
                      <span className="text-2xl font-black text-purple-400">
                        {total}
                      </span>
                      <button
                        onClick={() => deleteTeam(t.id)}
                        className="ml-2 px-2 py-1 rounded bg-red-600/70 hover:bg-red-500 text-white text-xs"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map((round) => (
                      <div key={round} className="bg-black/50 rounded-xl p-3">
                        <label className="block text-xs text-gray-400 mb-1 text-center">
                          第 {round} 轮
                        </label>
                        <input
                          type="number"
                          value={t[`round${round}`]}
                          onChange={(e) =>
                            updateScore(t.id, round, e.target.value)
                          }
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 text-xl font-bold text-white text-center focus:outline-none focus:border-cyan-500 transition"
                        />
                      </div>
                    ))}
                  </div>

                  {/* 历史记录 */}
                  {t.history.length > 0 && (
                    <details className="mt-4 group">
                      <summary className="cursor-pointer text-xs text-gray-500 hover:text-cyan-400 transition select-none">
                        查看历史记录（{t.history.length} 条）
                      </summary>
                      <ul className="mt-2 text-xs text-gray-400 space-y-1 max-h-32 overflow-y-auto border-t border-gray-800 pt-2">
                        {t.history
                          .slice()
                          .reverse()
                          .map((h, i) => (
                            <li key={i} className="flex justify-between">
                              <span>[{h.time}] 第{h.round}轮</span>
                              <span className="text-gray-500">
                                {h.oldValue} → <span className="text-cyan-400">{h.newValue}</span>
                              </span>
                            </li>
                          ))}
                      </ul>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}