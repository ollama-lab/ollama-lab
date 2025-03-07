import { DotIcon } from "lucide-solid";
import { Component } from "solid-js";
import { cn } from "~/lib/utils/class-names";

export type DotStatus = "success" | "warning" | "error" | "disabled";

const StatusDot: Component<{
  status: DotStatus;
}> = (props) => {
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

export default StatusDot;
