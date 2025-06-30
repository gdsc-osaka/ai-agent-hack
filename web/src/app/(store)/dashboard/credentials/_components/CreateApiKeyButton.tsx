'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import api, { bodySerializers } from '@/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CreateApiKeyButtonProps {
  storeId: string;
}

export default function CreateApiKeyButton({ storeId }: CreateApiKeyButtonProps) {
  const router = useRouter();

  async function handleCreateApiKey() {
    const { data, error } = await api().POST('/api/v1/stores/{storeId}/api-keys', {
      params: {
        path: {
          storeId
        }
      },
      bodySerializer: bodySerializers.form,
    });

    if (error) {
      toast.error(`APIキーの作成に失敗しました. ${error.message}`);
      return;
    }

    toast.success(`APIキーを作成しました ! (${data.apiKey})`);
    router.refresh();
  }

  return (
    <Button variant="default" onClick={handleCreateApiKey}>
      <Plus/> APIキーを作成
    </Button>
  )
}