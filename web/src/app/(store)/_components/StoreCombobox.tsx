'use client';

import { Store } from '@/api';
import { Combobox } from '@/components/ui/combobox';
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommandSeparator } from '@/components/ui/command';
import CreateStoreDialog from '@/app/(store)/_components/CreateStoreDialog';

interface StoreComboboxProps {
  stores: Store[];
  initialStoreId: string | undefined;
}

export default function StoreCombobox({ stores, initialStoreId }: StoreComboboxProps) {
  // console.log('StoreCombobox rendered with initialStoreId:', initialStoreId);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(initialStoreId);

  const router = useRouter();

  function handleValueChange(newValue: string) {
    setValue(newValue);
    setOpen(false);

    const currUrl = new URL(window.location.href);
    currUrl.searchParams.set('store', newValue);
    router.push(currUrl.toString());
    router.refresh();
  }

  return (
    <Combobox values={stores.map((store) => ({ value: store.id, label: store.id }))} open={open}
              onOpenChange={setOpen}
              value={value} onValueChange={handleValueChange} placeholder={'店舗を選択...'}
              notFoundText={'店舗が見つかりません'}>
      <CommandSeparator />
      <CreateStoreDialog/>
    </Combobox>
  );
}