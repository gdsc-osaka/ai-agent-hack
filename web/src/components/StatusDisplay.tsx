import { type LucideProps } from "lucide-react";
import { forwardRef } from "react";

type StatusDisplayProps = {
  icon: React.ComponentType<LucideProps>;
  message: string;
  className?: string;
};

export const StatusDisplay = forwardRef<HTMLDivElement, StatusDisplayProps>(
  ({ icon: Icon, message, className }, ref) => {
    return (
      <div ref={ref} className={`flex flex-col items-center justify-center gap-4 text-center p-8 ${className}`}>
        <Icon className="h-12 w-12 text-orange-500 animate-pulse" />
        <p className="text-2xl font-medium text-white">{message}</p>
      </div>
    );
  }
);
StatusDisplay.displayName = "StatusDisplay";