export default function TestUI() {
  return (
    <main className="max-w-screen-sm mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">UI OK</h1>
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <p className="text-sm text-gray-600 line-clamp-2">
          Это карточка с тенями, закруглениями и line-clamp. Если выглядит
          современно — Tailwind применяется.
        </p>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-lg font-semibold">1 234 ₽</div>
          <button className="px-3 py-2 rounded-xl bg-[var(--btn)] text-[var(--btn-text)] text-sm font-medium">
            Добавить
          </button>
        </div>
      </div>
    </main>
  );
}
