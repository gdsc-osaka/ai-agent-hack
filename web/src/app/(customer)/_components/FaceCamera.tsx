import React from 'react';
import { clsx } from 'clsx';

export default React.forwardRef( function FaceCamera({className}: {className?: string}, ref: React.ForwardedRef<HTMLVideoElement>) {
  return (
    <video ref={ref} autoPlay playsInline className={clsx("w-full h-full sm:w-fit sm:h-[60vh] object-cover rounded-lg shadow-lg aspect-[3/4]", className)} muted={true}
           style={{ transform: 'scaleX(-1)' }}
    />
  );
})