import { getSession, signOut } from '../../auth';
import { Button } from '../../components/ui/button';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';

async function logout() {
  'use server';
  const { error } = await signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect('/');
      },
    },
  });

  if (error) {
    console.error('Logout failed:', error);
  }
}

export default async function Dashboard() {
  const { data, error } = await getSession();

  if (!data) {
    return (
      <main>
        <h1>ログインが必要なページ</h1>
        <p>ログインしてください。</p>
      </main>
    );
  }

  return (
    <div className={'h-full flex'}>
      <Card className="w-full max-w-sm m-auto">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={'flex flex-col gap-2'}>
            <Label>セッション情報</Label>
            <div>
              {JSON.stringify(data, null, 2)}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <form action={logout}>
            <Button type="submit" className="w-full">
              Sign Out
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
    // <main>
    //   <h2>セッション情報</h2>
    //   <p>{JSON.stringify(data, null, 2)}</p>
    //   <h1>エラー情報</h1>
    //   {error && <p>{JSON.stringify(error, null, 2)}</p>}
    //   <form action={async () => {
    //     'use server';
    //     await signOut({
    //       fetchOptions: {
    //         onSuccess: () => {
    //           redirect('/');
    //         }
    //       }
    //     });
    //   }}>
    //     <Button type={'submit'}>
    //       ログアウト
    //     </Button>
    //   </form>
    // </main>
  );
}