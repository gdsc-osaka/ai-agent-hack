import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type CameraToggleButtonProps = {
  isCameraOn: boolean;
  onToggle: () => void;
};

export function CameraToggleButton({ isCameraOn, onToggle }: CameraToggleButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggle}
      className="rounded-full h-12 w-12 bg-black/50 border-white/50 backdrop-blur-sm hover:bg-black/70"
    >
      {isCameraOn ? (
        <CameraOff className="h-6 w-6 text-orange-500" />
      ) : (
        <Camera className="h-6 w-6 text-white" />
      )}
    </Button>
  );
}