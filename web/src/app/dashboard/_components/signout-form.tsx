"use client";

import { Button } from "../../../components/ui/button";
import { authClient } from "../../../auth-client";
import { redirect } from "next/navigation";

export default function SignOutForm() {
  async function handleSignOut() {
    const { error } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/");
        },
      },
    });

    if (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <form action={handleSignOut}>
      <Button type="submit" className="w-full">
        Sign Out
      </Button>
    </form>
  );
}
