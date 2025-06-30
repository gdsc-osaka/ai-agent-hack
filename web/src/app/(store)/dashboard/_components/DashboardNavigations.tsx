'use client';

import { User } from 'better-auth';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

const navigations = [{ label: 'ダッシュボード', path: '/dashboard' }, { label: '認証情報', path: '/dashboard/credentials' }, { label: '設定', path: '/dashboard/settings' }];

export default function DashboardNavigations({ user }: {user: User}) {
  const pathname = usePathname();

  // console.log(new URLSearchParams(window.location.search).toString())
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex flex-col gap-1 items-start'}>
        <p className={'text-base font-semibold truncate w-full'}>{user.name}</p>
        <p className={'text-sm text-muted-foreground truncate w-full'}>{user.email}</p>
      </div>
      {/* Navigation */}
      <Separator className={'my-2'}/>
      <div className={'flex flex-col gap-0.5'}>
        {navigations.map(({ label, path }) => (
          <Button
            key={path}
            variant={path === pathname ? 'outline' : 'ghost'}
            className={'w-full justify-start'}
            disabled={path === pathname}
            asChild
          >
            <Link href={{
              pathname: path,
              // query: new URLSearchParams(window.location.search).toString()
            }}>{label}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}