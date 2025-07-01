'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateStoreForm from '@/app/(store)/dashboard/_components/CreateStoreForm';
import { CommandItem } from '@/components/ui/command';
import { Plus } from 'lucide-react';
import * as React from 'react';

export default function CreateStoreDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CommandItem className={'m-1'} onSelect={() => setOpen(true)}>
          <Plus />
          新規店舗を作成
        </CommandItem>
      </DialogTrigger>
      <DialogContent className="max-w-4xl grid grid-rows-[auto_1fr_auto] gap-4 p-6">
        <DialogHeader className="p-0">
          <DialogTitle className="text-xl font-bold">新規店舗を作成</DialogTitle>
        </DialogHeader>
        <CreateStoreForm />
        {/*<DialogFooter>*/}
        {/*  <Button*/}
        {/*    variant="outline"*/}
        {/*    onClick={onDecline}*/}
        {/*    className="min-w-[100px]"*/}
        {/*  >*/}
        {/*    キャンセル*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    onClick={onAccept}*/}
        {/*    className="min-w-[100px]"*/}
        {/*  >*/}
        {/*    作成*/}
        {/*  </Button>*/}
        {/*</DialogFooter>*/}
      </DialogContent>
    </Dialog>
  );
}