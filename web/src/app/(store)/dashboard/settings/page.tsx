import { Heading2 } from '@/app/(store)/_components/Heading';
import { Separator } from '@/components/ui/separator';

export default function() {
  return (
    <main className={'flex flex-col gap-8'}>
      <Heading2>
        設定
      </Heading2>
      <Separator />
    </main>
  );
}