import { Camera } from 'lucide-react';

export default function FaceCameraSkeleton() {
  return (
    <div className={"w-full h-full object-cover rounded-lg shadow-lg aspect-[3/4] bg-card flex flex-col gap-4 items-center justify-center"}>
      <Camera className="w-12 h-12 text-card-foreground" />
      <p className={'text-card-foreground text-lg'}>
        顔を認識中
      </p>
    </div>
  );
}