import { Flame, Wine } from 'lucide-react';

export default function AppLogo() {
  return (
    <div className={'flex gap-1 items-center'}>
      <Wine className="h-6 w-6 text-brand" />
      <span className="font-bold text-xl text-white">WhatWeTalked</span>
    </div>
  )
}