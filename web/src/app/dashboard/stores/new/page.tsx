import { Card } from "@/components/ui/card";
import CreateStoreForm from "@/app/dashboard/stores/new/_components/create-store-form";

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
