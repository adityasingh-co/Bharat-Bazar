export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
        <p className="text-zinc-500">Loading admin...</p>
      </div>
    </div>
  )
}
