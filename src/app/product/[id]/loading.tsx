export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-zinc-200 rounded mb-8"></div>
          
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Image skeleton */}
            <div className="aspect-square rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
            
            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-20 bg-zinc-200 rounded"></div>
              <div className="h-10 w-3/4 bg-zinc-200 rounded"></div>
              <div className="h-8 w-32 bg-zinc-200 rounded"></div>
              <div className="space-y-2 mt-6">
                <div className="h-4 w-full bg-zinc-200 rounded"></div>
                <div className="h-4 w-full bg-zinc-200 rounded"></div>
                <div className="h-4 w-2/3 bg-zinc-200 rounded"></div>
              </div>
              <div className="h-12 w-full bg-zinc-200 rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
