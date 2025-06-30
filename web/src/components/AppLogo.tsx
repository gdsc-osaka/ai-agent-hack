import { Flame } from 'lucide-react';

export default function AppLogo() {
  return (
    <div className={'flex gap-2 items-center'}>
      <Flame className="h-6 w-6 text-orange-500" />
      <span className="font-bold text-xl text-white">Recall</span>
    </div>
  )
}