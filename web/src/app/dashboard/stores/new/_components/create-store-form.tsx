'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/api';

const createStoreFormSchema = z.object({
  storeName: z
    .string()
    .min(1, { message: '店舗名は必須です。' })
    .max(50, { message: '店舗名は50文字以内で入力してください。' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: '店舗名は英数字とアンダースコア(_)のみ使用できます。',
    })
});
type CreateStoreFormValues = z.infer<typeof createStoreFormSchema>;

export default function() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<CreateStoreFormValues>({
    resolver: zodResolver(createStoreFormSchema),
    defaultValues: {
      storeName: '',
    },
  });

  async function onSubmit(data: CreateStoreFormValues) {
    setIsLoading(true);
    setApiError(null);

      const { data: store, error } = await api().POST('/api/v1/stores', {
        body: {
          id: data.storeName
        }
      });

      if (error) {
        setApiError(error.message);
        toast.error(error.message);
        return;
      }

      toast.success(`店舗 ${store.id} を作成しました！`);
      form.reset();
      setIsLoading(false);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>店舗名</FormLabel>
                <FormControl>
                  <Input placeholder="Bar Recall" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>
                  あなたの店舗の名前を入力してください。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* APIエラーメッセージ表示 */}
          {apiError && (
            <p className="text-sm font-medium text-destructive">{apiError}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? '作成中...' : '店舗を作成'}
          </Button>
        </form>
      </Form>
    </>
  );
};
