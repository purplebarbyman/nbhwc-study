export default function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <div className="space-y-2">
            <div className="h-2 bg-primary-200 rounded animate-pulse"></div>
            <div className="h-2 bg-primary-200 rounded animate-pulse w-3/4 mx-auto"></div>
            <div className="h-2 bg-primary-200 rounded animate-pulse w-1/2 mx-auto"></div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          NBHWC Study Platform
        </h1>
        <p className="text-gray-600 mb-4">
          Preparing your personalized learning experience...
        </p>
        
        <div className="text-sm text-gray-500">
          <p>Loading study materials and progress data</p>
        </div>
      </div>
    </div>
  )
}
