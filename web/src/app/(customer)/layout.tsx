import React from 'react';
import { CustomerHeader } from '@/app/(customer)/_components/CustomerHeader';

export default async function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <CustomerHeader />
      {children}
    </main>
  );
}