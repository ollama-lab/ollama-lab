import { DotIcon } from "lucide-solid";
import { cn } from "~/lib/utils/class-names";

export type DotStatus = "success" | "warning" | "error" | "disabled";

export interface StatusDotProps {
  status: DotStatus;
}

export default function StatusDot(props: StatusDotProps) {
  const status = () => props.status;

  return (
    <DotIcon
      class={cn(
        "size-10 -m-2",
        status() === "success" && "text-green-600",
        status() === "warning" && "text-yellow-600",
        status() === "error" && "text-red-600",
        status() === "disabled" && "text-gray-600",
      )}
    />
  );
}
