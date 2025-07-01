import { Card } from '@/components/ui/card';
import CreateStoreForm from '@/app/(store)/dashboard/_components/CreateStoreForm';

// const createStoreAction = async () => {
//   'use server';
// };

export default function () {
  return (
    <main className={"h-full flex flex-col items-center justify-center"}>
      <Card className={"gap-2"}>
        <h1 className={"text-2xl"}>Set up your store</h1>
        <CreateStoreForm />
      </Card>
    </main>
  );
}
