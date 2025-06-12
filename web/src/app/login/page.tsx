import { redirect } from 'next/navigation';
import { signIn } from '../../auth';

async function login(formData: FormData) {
  'use server'
  await signIn.email({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    callbackURL: '/dashboard',
    rememberMe: true,
  })

  redirect('/dashboard');
}

export default function Page() {
  return (
    <main>
      <h1>ログインフォーム</h1>
      <form action={login}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password"/>
        </div>
        <button type="submit">送信</button>
      </form>
    </main>
  )
}