"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link';
import { authClient } from '../../../../auth-client';

export default function LoginForm() {
  const router = useRouter();

  async function handleLogin(formData: FormData) {
    await authClient.signIn.email(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        callbackURL: "/dashboard",
        rememberMe: true,
      },
      {
        onSuccess: () => {
          console.log("Login successful");
          router.push("/dashboard");
        },
        onError: (error) => {
          console.error("Login error:", error);
        },
      }
    );
  }

  return (
    <form className={"h-full flex"} action={handleLogin}>
      <Card className="w-full max-w-sm m-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <hr className="mx-6 my-1" />
          <Link href={"/signup"}>
            <Button variant={"ghost"} className="w-full">
              Do not have an account? Create an account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}
