import { CustomersPage } from '@/components/pages/CustomersPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '顧客管理',
  description: 'バーの顧客情報を管理・検索できます。顧客の来店履歴、好みの飲み物、会話トピックを一元管理。',
  keywords: ['顧客管理', '顧客情報', '来店履歴', 'バー経営'],
  openGraph: {
    title: '顧客管理 | Bar CMS',
    description: 'バーの顧客情報を管理・検索できます。顧客の来店履歴、好みの飲み物、会話トピックを一元管理。',
  },
}

export default function Page() {
  return <CustomersPage />
}