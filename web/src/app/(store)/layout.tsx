import DashboardNavigations from '@/app/(store)/dashboard/_components/DashboardNavigations';
import { getSession } from '@/session';
import React from 'react';
import { StoreHeader } from '@/app/(store)/_components/StoreHeader';
import api from '@/api';
import { headers } from 'next/headers';

export default async function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, error } = await getSession();
  const { data: stores } = await api(headers).GET('/api/v1/staffs/me/stores');

  if (error) {
    return (
      <main>
        <h1>{error.status}: {error.message}</h1>
      </main>
    );
  }

  return (
    <div className={'px-8 pb-16 pt-20 grid grid-cols-1 gap-12 md:grid-cols-4 h-full'}>
      {/* TODO: stores が存在しないときの例外処理を追加 */}
      <StoreHeader stores={stores?.stores ?? []} user={session?.user} storeId={stores?.stores.at(0)?.id} />
      <DashboardNavigations user={session.user}/>
      <div className={'md:col-span-3'}>
        {children}
      </div>
    </div>
  );
}