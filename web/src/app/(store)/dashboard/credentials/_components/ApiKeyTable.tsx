import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StoreApiKey } from '@/api';
import { convertTimestampToDate } from '@/lib/convertors';
import CopyButton from '@/app/(store)/dashboard/credentials/_components/CopyButton';

interface ApiKeyTableProps {
  apiKeys: StoreApiKey[];
}

export default function ApiKeyTable({ apiKeys }: ApiKeyTableProps) {
  return (
    <Table className={"w-full table-fixed"}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[70%]">API キー</TableHead>
          <TableHead>作成日</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiKeys.map((apiKey) => (
          <TableRow key={apiKey.apiKey}>
            <TableCell className={'flex items-center justify-between'}>
              <span className="text-link font-medium truncate">
                {apiKey.apiKey}
              </span>
              <CopyButton text={apiKey.apiKey} successMessage={'API キーをコピーしました !'}/>
            </TableCell>
            <TableCell className="text-muted-foreground">{convertTimestampToDate(apiKey.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}