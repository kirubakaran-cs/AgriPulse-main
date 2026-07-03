import { Loader2 } from "lucide-react";

// Full-screen loading spinner used while auth state resolves.
export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 text-ink-500">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
