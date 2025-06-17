import SignOutForm from './_components/signout-form';
import api from '../../api';
import { headers } from 'next/headers';
import StoreItem from '@/app/dashboard/_components/store-item';

export default async function Dashboard() {
  const { data, error } = await api(headers).GET('/api/v1/staffs/me/stores');

  if (error) {
    return (
      <main>
        <h1>${error.code}: ${error.message}</h1>
        <p>${JSON.stringify(error.details)}</p>
      </main>
    );
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <h1 className={'text-2xl font-semibold'}>Dashboard</h1>
      <h2 className={'text-xl text-outline font-semibold'}>Stores</h2>
      <div className={'flex flex-col gap-3'}>
        {data.stores.map((store) => <StoreItem store={store} key={store.id} />)}
      </div>
      <SignOutForm />
    </div>
  );
}