export default function LoadingSkeleton() {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 h-[10vh] flex items-center">
          <div className="container mx-auto px-2 sm:px-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
              <div className="flex flex-1 max-w-2xl gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="w-full h-9 pl-8 pr-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border border-gray-700/50 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                </div>
                <div className="h-9 w-[70px] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-2 sm:px-3 py-3">
          <div className="mb-3">
            <div className="flex items-center justify-between p-2 bg-gray-900/30 rounded-lg border border-gray-800/30">
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                <div className="h-3 w-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
              </div>
              <div className="h-5 w-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded border border-gray-700/30 animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <ProjectCardSkeleton key={index} delay={index * 0.1} />
            ))}
          </div>
        </main>
      </div>
    )
  }
  
  function ProjectCardSkeleton({ delay = 0 }) {
    return (
      <div
        className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3 space-y-3 animate-pulse"
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="aspect-video bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-md animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          <div className="h-4 w-3/4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          <div className="h-3 w-5/6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          <div className="h-3 w-2/3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            <div className="h-3 w-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          </div>
          <div className="flex gap-1">
            <div className="h-5 w-5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            <div className="h-5 w-5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          </div>
        </div>
      </div>
    )
  }
  