import DashboardNavigations from '@/app/dashboard/_components/dashboard-navigations';
import { getSession } from '@/session';

export default async function({children}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, error } = await getSession();

  if (error) {
    return (
      <main>
        <h1>{error.status}: {error.message}</h1>
      </main>
    );
  }

  return (
    <div className={'px-8 py-16 grid grid-cols-1 gap-12 md:grid-cols-4 h-full'}>
      <DashboardNavigations user={session.user}/>
      <div className={'md:col-span-3'}>
        <div className={'p-8'}>
          {children}
        </div>
      </div>
    </div>
  );
}