import { getSession, signOut } from '../../auth';
import { Button } from '../../components/ui/button';
import { redirect } from 'next/navigation';


export default async function Dashboard() {
  const { data, error } = await getSession();

  if (!data) {
    return (
      <main>
        <h1>ログインが必要なページ</h1>
        <p>ログインしてください。</p>
      </main>
    )
  }

  return (
    <main>
      <h2>セッション情報</h2>
      <p>{JSON.stringify(data, null, 2)}</p>
      <h1>エラー情報</h1>
      {error && <p>{JSON.stringify(error, null, 2)}</p>}
      <form action={async () => {
        'use server';
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              redirect('/');
            }
          }
        });
      }}>
        <Button type={'submit'}>
          ログアウト
        </Button>
      </form>
    </main>
  )
}