import React from 'react';
import { clsx } from 'clsx';

export default function FaceCamera({ref, className}: {ref: React.RefObject<HTMLVideoElement | null>, className?: string}) {
  return (
    <video ref={ref} autoPlay playsInline className={clsx("w-full h-full object-cover rounded-lg shadow-lg aspect-[3/4]", className)} muted={true}
           style={{ transform: 'scaleX(-1)' }}
    />
  );
}