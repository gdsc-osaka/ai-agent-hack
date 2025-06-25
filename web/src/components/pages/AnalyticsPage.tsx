import { Navigation } from '@/components/Navigation';
import { TrendingUp } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation 
        activeTab="analytics" 
        onTabChange={() => {}}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">分析機能</h3>
          <p className="text-gray-400">売上分析とトレンド情報を表示予定</p>
        </div>
      </div>
    </div>
  );
}