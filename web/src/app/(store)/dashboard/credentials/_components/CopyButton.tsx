'use client';

import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';

export default function CopyButton({ text, successMessage }: { text: string, successMessage?: string }) {
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage ?? 'コピーしました！');
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Clipboard /> コピー
    </Button>
  );

}