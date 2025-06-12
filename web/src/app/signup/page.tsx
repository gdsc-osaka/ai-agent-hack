import { signUp } from '../../auth';

async function signup(formData: FormData) {
  'use server'
  // Credentialプロバイダを使ってログイン
  await signUp.email({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    callbackURL: '/dashboard',
    name: formData.get('name') as string,
  })
}

export default function Page() {
  return (
    <main>
      <h1>Sign up</h1>
      <form action={signup}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password"/>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" required/>
        </div>
        <button type="submit">送信</button>
      </form>
    </main>
  )
}