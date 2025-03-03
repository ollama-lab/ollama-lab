import type { JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SelectPrimitive from "@kobalte/core/select";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils/class-names";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectHiddenSelect = SelectPrimitive.HiddenSelect;

export type SelectTriggerProps<T extends ValidComponent = "button"> = SelectPrimitive.SelectTriggerProps<T> & {
  class?: string | undefined;
  children?: JSX.Element;
};

export const SelectTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, SelectTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectTriggerProps, ["class", "children"]);
  return (
    <SelectPrimitive.Trigger
      class={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <ChevronsUpDownIcon class="size-4 opacity-50" />
    </SelectPrimitive.Trigger>
  );
};

export type SelectContentProps<T extends ValidComponent = "div"> = SelectPrimitive.SelectContentProps<T> & {
  class?: string | undefined;
};

export const SelectContent = <T extends ValidComponent = "div">(props: PolymorphicProps<T, SelectContentProps<T>>) => {
  const [local, others] = splitProps(props as SelectContentProps, ["class"]);
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        class={cn(
          "relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ease-in-out animate-in fade-in slide-in-from-top-5 data-[closed]:animate-out data-[closed]:fade-out data-[closed]:slide-out-to-top-5",
          local.class,
        )}
        {...others}
      >
        <SelectPrimitive.Listbox class="m-0 p-1" />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

export type SelectItemProps<T extends ValidComponent = "li"> = SelectPrimitive.SelectItemProps<T> & {
  class?: string | undefined;
  children?: JSX.Element;
};

export const SelectItem = <T extends ValidComponent = "li">(props: PolymorphicProps<T, SelectItemProps<T>>) => {
  const [local, others] = splitProps(props as SelectItemProps, ["class", "children"]);
  return (
    <SelectPrimitive.Item
      class={cn(
        "relative mt-0 flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class,
      )}
      {...others}
    >
      <SelectPrimitive.ItemIndicator class="absolute right-2 flex size-3.5 items-center justify-center">
        <CheckIcon class="size-4" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemLabel>{local.children}</SelectPrimitive.ItemLabel>
    </SelectPrimitive.Item>
  );
};

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        label: "data-[invalid]:text-destructive",
        description: "font-normal text-muted-foreground",
        error: "text-xs text-destructive",
      },
    },
    defaultVariants: {
      variant: "label",
    },
  },
);

export type SelectLabelProps<T extends ValidComponent = "label"> = SelectPrimitive.SelectLabelProps<T> & {
  class?: string | undefined;
};

export const SelectLabel = <T extends ValidComponent = "label">(props: PolymorphicProps<T, SelectLabelProps<T>>) => {
  const [local, others] = splitProps(props as SelectLabelProps, ["class"]);
  return <SelectPrimitive.Label class={cn(labelVariants(), local.class)} {...others} />;
};

export type SelectDescriptionProps<T extends ValidComponent = "div"> = SelectPrimitive.SelectDescriptionProps<T> & {
  class?: string | undefined;
};

export const SelectDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectDescriptionProps, ["class"]);
  return <SelectPrimitive.Description class={cn(labelVariants({ variant: "description" }), local.class)} {...others} />;
};

export type SelectErrorMessageProps<T extends ValidComponent = "div"> = SelectPrimitive.SelectErrorMessageProps<T> & {
  class?: string | undefined;
};

export const SelectErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectErrorMessageProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectErrorMessageProps, ["class"]);
  return <SelectPrimitive.ErrorMessage class={cn(labelVariants({ variant: "error" }), local.class)} {...others} />;
};
