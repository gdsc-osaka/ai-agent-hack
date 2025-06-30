"use client";

import { User } from "better-auth";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function DashboardNavigations({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"flex flex-col gap-1 items-start"}>
        <p className={"text-base font-semibold truncate w-full"}>{user.name}</p>
        <p className={"text-sm text-gray-700 truncate w-full"}>{user.email}</p>
      </div>
      {/* Navigation */}
      <Separator className={"my-2"} />
      <div className={"flex flex-col gap-0.5"}>
        {[
          { label: "Overview", path: "/dashboard" },
          { label: "Settings", path: "/dashboard/settings" },
        ].map(({ label, path }) => (
          <Button
            key={path}
            variant={path === pathname ? "outline" : "ghost"}
            className={"w-full justify-start"}
            disabled={path === pathname}
            asChild
          >
            <Link href={path}>{label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
