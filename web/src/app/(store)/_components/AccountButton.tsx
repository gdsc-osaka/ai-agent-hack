'use client';

import { User } from 'better-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/auth-client';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

interface AccountButtonProps {
  user?: User;
}

export default function AccountButton({user}: AccountButtonProps) {
  async function handleSignOut() {
    const { error } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect('/');
        },
      },
    });

    if (error) {
      toast.error(`ログアウトに失敗しました. ${error.message}`);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={user?.image ?? '/account_circle.png'} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>アカウント</DropdownMenuLabel>
        {/*<DropdownMenuSeparator/>*/}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSignOut}>
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}