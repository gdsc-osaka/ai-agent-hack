import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import SignOutForm from './_components/signout-form';
import api from '../../api';
import { headers } from 'next/headers';
import DashboardNavigations from '@/app/dashboard/_components/dashboard-navigations';
import { getSession } from '@/session';

export default async function Dashboard() {
  const { data, error } = await api(headers).GET("/api/v1/staffs/me/stores");
  const { data: session, error: sessionError } = await getSession();

  if (error) {
    return (
      <main>
        <h1>${error.code}: ${error.message}</h1>
        <p>${JSON.stringify(error.details)}</p>
      </main>
    );
  }

  if (sessionError) {
    return (
      <main>
        <h1>${sessionError.status}: ${sessionError.message}</h1>
      </main>
    );
  }

  if (data.length === 0) {
    // redirect('/dashboard/stores/invites');
  }

  return (
    <div className={'px-8 py-16 grid grid-cols-1 gap-12 md:grid-cols-4 h-full'}>
      <DashboardNavigations user={session.user} pathname={'/dashboard'}/>
      <div className={'md:col-span-3'}>
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={'flex flex-col gap-2'}>
              <Label>Stores</Label>
              <div>
                {JSON.stringify(data, null, 2)}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <SignOutForm/>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}