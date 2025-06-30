import { Store } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StoreItem({ store }: { store: Store }) {
  return (
    <Card className="flex flex-col gap-2 px-2 py-4 border rounded-md shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Store ID: {store.id}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Created At:{" "}
          {new Date(store.createdAt.seconds * 1000).toLocaleString()}
        </p>
        <p>
          Updated At:{" "}
          {new Date(store.updatedAt.seconds * 1000).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
