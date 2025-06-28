import { BarChart3 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <BarChart3 className="w-8 h-8 text-gray-900" />
        </div>
        
        <div className="space-y-3">
          <div className="w-32 h-4 bg-gray-700 rounded mx-auto animate-pulse"></div>
          <div className="w-24 h-3 bg-gray-800 rounded mx-auto animate-pulse"></div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}