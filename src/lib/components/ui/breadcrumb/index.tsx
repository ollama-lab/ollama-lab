import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";

import type { PolymorphicProps } from "@kobalte/core";
import * as BreadcrumbPrimitive from "@kobalte/core/breadcrumbs";

import { cn } from "~/lib/utils/class-names";
import { EllipsisIcon, SlashIcon } from "lucide-solid";

const Breadcrumb = BreadcrumbPrimitive.Root;

const BreadcrumbList: Component<ComponentProps<"ol">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ol
      class={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        local.class,
      )}
      {...others}
    />
  );
};

const BreadcrumbItem: Component<ComponentProps<"li">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <li class={cn("inline-flex items-center gap-1.5", local.class)} {...others} />;
};

type BreadcrumbLinkProps<T extends ValidComponent = "a"> = BreadcrumbPrimitive.BreadcrumbsLinkProps<T> & {
  class?: string | undefined;
};

const BreadcrumbLink = <T extends ValidComponent = "a">(props: PolymorphicProps<T, BreadcrumbLinkProps<T>>) => {
  const [local, others] = splitProps(props as BreadcrumbLinkProps, ["class"]);
  return (
    <BreadcrumbPrimitive.Link
      class={cn(
        "transition-colors hover:text-foreground data-[current]:font-normal data-[current]:text-foreground select-none",
        local.class,
      )}
      {...others}
    />
  );
};

type BreadcrumbSeparatorProps<T extends ValidComponent = "span"> = BreadcrumbPrimitive.BreadcrumbsSeparatorProps<T> & {
  class?: string | undefined;
  children?: JSX.Element;
};

const BreadcrumbSeparator = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, BreadcrumbSeparatorProps<T>>,
) => {
  const [local, others] = splitProps(props as BreadcrumbSeparatorProps, ["class", "children"]);
  return (
    <BreadcrumbPrimitive.Separator class={cn("[&>svg]:size-3.5 select-none", local.class)} {...others}>
      <Show
        when={local.children}
        fallback={<SlashIcon />}
      >
        {local.children}
      </Show>
    </BreadcrumbPrimitive.Separator>
  );
};

const BreadcrumbEllipsis: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span class={cn("flex size-9 items-center justify-center", local.class)} {...others}>
      <EllipsisIcon />
      <span class="sr-only">More</span>
    </span>
  );
};

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbEllipsis };
