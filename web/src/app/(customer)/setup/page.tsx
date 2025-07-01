'use client';

import ApiKeySetupForm from '@/components/ApiKeySetupForm';
import { Card } from '@/components/ui/card';
import api from '@/api';
import { toast } from 'sonner';
import { useSetAtom } from 'jotai/react';
import { apiKeyAtom } from '@/app/atoms';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();
  const setApiKey = useSetAtom(apiKeyAtom);

  async function handleSubmit(apiKey: string) {
    const { data: store, error } = await api(apiKey).GET('/api/v1/stores/me')

    if (error) {
      toast.error(error.message);
      return;
    }

    setApiKey(apiKey);
    toast.success(`API キーを設定しました！ (店舗: ${store.id})`);
    router.push('/');
  }

  return (
    <main className={'flex flex-col items-center justify-center h-screen w-full p-4'}>
      <Card className={"w-full"}>
      <ApiKeySetupForm onSubmit={handleSubmit}/>
      </Card>
    </main>
  )
}