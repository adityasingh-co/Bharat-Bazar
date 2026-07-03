export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    </div>
  )
}
