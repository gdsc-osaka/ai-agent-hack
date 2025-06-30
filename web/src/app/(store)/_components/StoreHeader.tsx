import Link from 'next/link';
import AppLogo from '@/components/AppLogo';
import { Store } from '@/api';
import StoreCombobox from '@/app/(store)/_components/StoreCombobox';
import AccountButton from '@/app/(store)/_components/AccountButton';
import { User } from 'better-auth';
import { Button } from '@/components/ui/button';

interface StoreHeaderProps {
  stores: Store[];
  user?: User;
  storeId: string | undefined;
}

export function StoreHeader({ stores, user, storeId }: StoreHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-between items-center bg-transparent">
      <div className={'flex items-center gap-4'}>
        <Link href={'/dashboard'}>
          <AppLogo />
        </Link>
        <StoreCombobox stores={stores} initialStoreId={storeId} />
      </div>
      <div className="flex items-center gap-2">
        <Link href={"/"}>
          <Button variant={"secondary"}>
            顔認証画面へ移動
          </Button>
        </Link>
        <AccountButton user={user}/>
      </div>
    </header>
  );
}