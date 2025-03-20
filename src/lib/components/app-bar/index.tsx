import { Section } from "~/lib/models/section";
import { BotIcon, BotMessageSquareIcon, MessagesSquareIcon, PackageIcon, SettingsIcon } from "lucide-solid";
import { TabLink } from "./tab-link";
import { useLocation } from "@solidjs/router";
import { Component, createMemo, For, JSX } from "solid-js";
import { cn } from "~/lib/utils/class-names";
import { getCurrentSettings } from "~/lib/contexts/globals/settings";

const TabList: Component<{
  tabs: Section[];
  class?: string;
  children?: JSX.Element | string;
  activeTab?: string;
}> = (props) => {
  const activeTab = () => props.activeTab ?? "";

  return (
    <div class={cn("flex flex-col", props.class)}>
      {props.children}
      <For each={props.tabs}>
        {({ name, icon, href, activePattern, onClick }) => (
          <TabLink href={href} onClick={onClick} name={name} active={activePattern?.test(activeTab())}>
            {icon}
          </TabLink>
        )}
      </For>
    </div>
  );
};

const TopTabList: Component = () => {
  const loc = useLocation();
  const pathname = createMemo(() => loc.pathname);

  const tabs = createMemo<Section[]>(() => {
    const h2hEnabled = getCurrentSettings().h2h ?? false;

    const tabList = [
      {
        name: "Sessions",
        icon: <BotMessageSquareIcon />,
        href: "/",
        activePattern: /^\/?$/,
      },
      {
        name: "Models",
        icon: <PackageIcon />,
        href: "/models",
        activePattern: /^\/models(\/*.)?/,
      },
    ];

    if (h2hEnabled) {
      tabList.splice(
        1, 0,
        {
          name: "Head-to-head",
          icon: <MessagesSquareIcon />,
          href: "/h2h",
          activePattern: /^\/h2h(\/*.)?/,
        },
        {
          name: "Agents Personas",
          icon: <BotIcon />,
          href: "/agent-templates",
          activePattern: /^\/agent-templates(\/*.)?/,
        },
      );
    }

    return tabList;
  });

  return (
    <TabList tabs={tabs()} class="grow" activeTab={pathname()} />
  );
};

const BottomTabList: Component = () => {
  const loc = useLocation();
  const pathname = createMemo(() => loc.pathname);

  const tabs = createMemo<Section[]>(() => {
    return [
      {
        name: "Settings",
        icon: <SettingsIcon />,
        href: "/settings",
        activePattern: /^\/settings(\/*.)?/,
      },
    ];
  });

  return (
    <TabList tabs={tabs()} class="shrink-0" activeTab={pathname()} />
  );
};

export const AppBar: Component = () => {
  return (
    <nav class="sticky flex flex-col border-r border-border px-1 py-1 shrink-0">
      <TopTabList />
      <BottomTabList />
    </nav>
  );
}
