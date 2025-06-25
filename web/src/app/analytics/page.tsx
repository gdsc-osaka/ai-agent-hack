import { AnalyticsPage } from '@/components/pages/AnalyticsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '分析',
  description: 'バーの売上分析、顧客トレンド、人気メニューなどの統計情報を確認できます。',
  keywords: ['売上分析', 'トレンド分析', '統計', 'ビジネス分析'],
  openGraph: {
    title: '分析 | Bar CMS',
    description: 'バーの売上分析、顧客トレンド、人気メニューなどの統計情報を確認できます。',
  },
}

export default function Page() {
  return <AnalyticsPage />
}