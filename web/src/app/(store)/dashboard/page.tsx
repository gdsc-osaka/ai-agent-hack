import { Separator } from '@/components/ui/separator';
import api from '@/api';
import { headers } from 'next/headers';
import CustomerItem from '@/app/(store)/dashboard/_components/CustomerItem';
import { Heading2, Heading3 } from '@/app/(store)/_components/Heading';

export default async function Dashboard({
                                          searchParams,
                                        }: {
  searchParams?: Promise<{ store: string | undefined }>;
}) {
  const sParams = await searchParams;
  if (sParams?.store === undefined) {
    return (
      <main className={'flex flex-col gap-8'}>
        <h2 className={'text-2xl font-semibold'}>
          ダッシュボード
        </h2>
        <Separator />
        <p>店舗が選択されていません。</p>
      </main>
    );
  }

  const { data: customers, error } = await api(headers).GET('/api/v1/stores/{storeId}/customers', {
    params: {
      path: {
        storeId: sParams?.store,
      },
      query: {
        status: 'visiting',
      },
    },
  });

  return (
    <main className={'flex flex-col gap-8'}>
      <Heading2>
        ダッシュボード
      </Heading2>
      <Separator />
      <div className={'flex flex-col gap-3'}>
        <Heading3>
          顧客情報
        </Heading3>
        {/*<p className="text-sm text-muted-foreground pb-2">*/}
        {/*  来店中の顧客を表示しています。*/}
        {/*</p>*/}
        {customers ? customers.map(({ customer, profiles }) => (
          <CustomerItem customer={customer} profiles={profiles} />
        )) : error.code === 'customer/not_found' ?
          <p className={'text-muted-foreground text-sm'}>顧客が見つかりませんでした.</p> :
          <p className={'text-destructive text-sm'}>
            顧客取得中にエラーが発生しました. {error.message}
          </p>}
      </div>
    </main>
  );
}