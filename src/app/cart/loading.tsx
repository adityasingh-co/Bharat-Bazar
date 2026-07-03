export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-200 rounded mb-8"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <div className="h-24 w-24 bg-zinc-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-zinc-200 rounded"></div>
                <div className="h-4 w-1/2 bg-zinc-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
