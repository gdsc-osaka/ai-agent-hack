import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { mockCustomers } from '@/lib/data'
import type { Customer } from '@/lib/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 環境変数からbaseUrlを取得、なければheadersから取得
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                  'http://localhost:3000'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard/customers`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard/analytics`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard/settings`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Dynamic customer pages
  const customerPages = mockCustomers.map((customer) => ({
    url: `${baseUrl}/dashboard/customers/${customer.id}`,
    lastModified: new Date(customer.lastVisit),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...customerPages]
}