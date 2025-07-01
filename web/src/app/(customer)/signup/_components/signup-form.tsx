"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link';
import { authClient } from '../../../../auth-client';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();

  async function handleSignup(formData: FormData) {
    await authClient.signUp.email(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        callbackURL: "/dashboard",
        name: formData.get("name") as string,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
  }

  return (
    <form action={handleSignup} className={"h-full flex"}>
      <Card className="w-full max-w-sm m-auto">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
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
              <Label htmlFor="email">Name</Label>
              <Input id="name" name="name" placeholder="Your Name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Sign up
          </Button>
          <hr className="mx-6 my-1" />
          <Link href={"/login"}>
            <Button variant={"ghost"} className="w-full">
              Already have an account? Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}
