export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-zinc-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-zinc-200 rounded mb-8"></div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Sidebar skeleton */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full bg-zinc-200 mb-4"></div>
                  <div className="h-6 w-32 bg-zinc-200 rounded mb-2"></div>
                  <div className="h-4 w-48 bg-zinc-200 rounded"></div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="h-5 w-32 bg-zinc-200 rounded"></div>
                <div className="flex justify-between">
                  <div className="h-10 w-10 rounded-full bg-zinc-200"></div>
                  <div className="h-6 w-16 bg-zinc-200 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-10 w-10 rounded-full bg-zinc-200"></div>
                  <div className="h-6 w-20 bg-zinc-200 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Main content skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="h-6 w-40 bg-zinc-200 rounded mb-2"></div>
                <div className="h-4 w-56 bg-zinc-200 rounded mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <div className="h-4 w-24 bg-zinc-200 rounded"></div>
                        <div className="h-4 w-20 bg-zinc-200 rounded"></div>
                        <div className="h-4 w-16 bg-zinc-200 rounded"></div>
                        <div className="h-6 w-20 bg-zinc-200 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
