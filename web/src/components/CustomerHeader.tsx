import { Settings, LogIn, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export function CustomerHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-between items-center bg-transparent">
      <Link href={"/"} className="flex items-center gap-2">
        <Flame className="h-6 w-6 text-orange-500" />
        <span className="font-bold text-xl text-white">Recall</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link href={"/setup"}>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-white" />
        </Button>
        </Link>
        <Link href={"/login"}>
          <Button variant="ghost" size="icon">
            <LogIn className="h-5 w-5 text-white" />
          </Button>
        </Link>
      </div>
    </header>
  );
}