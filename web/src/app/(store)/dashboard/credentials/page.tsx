import { Separator } from '@/components/ui/separator';
import ApiKeyTable from '@/app/(store)/dashboard/credentials/_components/ApiKeyTable';
import api from '@/api';
import { headers } from 'next/headers';
import CreateApiKeyButton from '@/app/(store)/dashboard/credentials/_components/CreateApiKeyButton';

export default async function CredentialsPage({
                                                searchParams,
                                              }: {
  searchParams?: Promise<{ store: string | undefined }>;
}) {
  const sParams = await searchParams;
  if (sParams?.store === undefined) {
    return (
      <main className={'flex flex-col gap-8'}>
        <h2 className={'text-2xl font-semibold'}>
          認証情報
        </h2>
        <Separator/>
        <p>店舗が選択されていません。</p>
      </main>
    );
  }

  const { data: apiKeys, error } = await api(headers).GET('/api/v1/stores/{storeId}/api-keys', {
    params: {
      path: {
        storeId: sParams.store
      }
    },
  });

  return (
    <main className={'flex flex-col gap-8'}>
      <h2 className={'text-2xl font-semibold'}>
        認証情報
      </h2>
      <Separator/>
      <div className={'flex flex-col gap-3'}>
        <div className="flex items-center justify-between h-11">
          <h3 className={'text-xl'}>
            API キー
          </h3>
          <CreateApiKeyButton storeId={sParams.store}/>
        </div>
        <p className="text-sm text-muted-foreground pb-2">
          店舗端末の右上のボタンから API キーを設定してください。
        </p>
        {apiKeys ? (
          <ApiKeyTable apiKeys={apiKeys.apiKeys}/>
        ) :
          error.code === "store_api_key/not_found" ?
            <p className={"text-card-foreground text-base"}>
              API キーがありません。右上のボタンから API キーを作成してください。
            </p>
            :
          (
          <p className={'text-destructive'}>
            {error.message}
          </p>
        )}
      </div>
    </main>
  )
}