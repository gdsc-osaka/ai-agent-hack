import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-gray-300 text-4xl font-bold">404</span>
        </div>
        
        <h1 className="text-white text-3xl font-bold mb-4">ページが見つかりません</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 bg-amber-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>ホームに戻る</span>
          </Link>
          
          <Link
            href="/customers"
            className="flex items-center justify-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>顧客一覧</span>
          </Link>
        </div>
      </div>
    </div>
  )
}