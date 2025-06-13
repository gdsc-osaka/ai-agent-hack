import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { getSession } from '../../session';
import SignOutForm from './_components/signout-form';

export default async function Dashboard() {
  const { data } = await getSession();

  if (!data) {
    return (
      <main>
        <h1>ログインが必要なページ</h1>
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
          <SignOutForm/>
        </CardFooter>
      </Card>
    </div>
  );
}