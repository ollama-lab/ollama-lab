import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import type { PolymorphicProps } from "@kobalte/core";
import * as SwitchPrimitive from "@kobalte/core/switch";

import { cn } from "~/lib/utils/class-names";

export const SwitchRoot = SwitchPrimitive.Root;
export const SwitchDescription = SwitchPrimitive.Description;
export const SwitchErrorMessage = SwitchPrimitive.ErrorMessage;

export type SwitchControlProps = SwitchPrimitive.SwitchControlProps & {
  class?: string | undefined;
};

export const SwitchControl = <T extends ValidComponent = "input">(props: PolymorphicProps<T, SwitchControlProps>) => {
  const [local, others] = splitProps(props as SwitchControlProps, ["class"]);
  return (
    <>
      <SwitchPrimitive.Input
        class={cn(
          "[&:focus-visible+div]:outline-none [&:focus-visible+div]:ring-2 [&:focus-visible+div]:ring-ring [&:focus-visible+div]:ring-offset-2 [&:focus-visible+div]:ring-offset-background",
          local.class,
        )}
      />
      <SwitchPrimitive.Control
        class={cn(
          "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input transition-[color,background-color,box-shadow] data-[disabled]:cursor-not-allowed data-[checked]:bg-primary data-[disabled]:opacity-50",
          local.class,
        )}
        {...others}
      >
        <SwitchThumb />
      </SwitchPrimitive.Control>
    </>
  );
};

type SwitchThumbProps = SwitchPrimitive.SwitchThumbProps & {
  class?: string | undefined;
};

const SwitchThumb = <T extends ValidComponent = "div">(props: PolymorphicProps<T, SwitchThumbProps>) => {
  const [local, others] = splitProps(props as SwitchThumbProps, ["class"]);
  return (
    <SwitchPrimitive.Thumb
      class={cn(
        "pointer-events-none block size-5 translate-x-0 rounded-full bg-background shadow-lg ring-0 transition-transform data-[checked]:translate-x-5",
        local.class,
      )}
      {...others}
    />
  );
};

export type SwitchLabelProps = SwitchPrimitive.SwitchLabelProps & {
  class?: string | undefined;
};

export const SwitchLabel = <T extends ValidComponent = "label">(props: PolymorphicProps<T, SwitchLabelProps>) => {
  const [local, others] = splitProps(props as SwitchLabelProps, ["class"]);
  return (
    <SwitchPrimitive.Label
      class={cn(
        "text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
        local.class,
      )}
      {...others}
    />
  );
};
