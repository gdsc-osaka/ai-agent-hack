import Link from 'next/link';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';

export default async function() {
  return (
    <main className={'h-full flex flex-col items-center justify-center'}>
      <Card>
        <h1 className={'text-2xl'}>Invites</h1>
        <Link href={'/dashboard/stores/new'}>
          <Button>
            Create New Store
          </Button>
        </Link>
      </Card>
    </main>
  )
}