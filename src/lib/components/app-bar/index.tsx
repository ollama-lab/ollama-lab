import { Section } from "~/lib/models/section";
import { BotMessageSquareIcon, PackageIcon, SettingsIcon } from "lucide-solid";
import { TabLink } from "./tab-link";
import { useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";

const tabs: Section[] = [
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

const footerTabs: Section[] = [
  {
    name: "Settings",
    icon: <SettingsIcon />,
    href: "/settings",
    activePattern: /^\/settings(\/*.)?/,
  },
];

export function AppBar() {
  const loc = useLocation();

  const pathname = createMemo(() => loc.pathname);

  return (
    <nav class="flex flex-col border-r border-border px-1 py-1">
      <div class="grow flex flex-col">
        {tabs.map(({ name, icon, href, activePattern, onClick }) => (
          <TabLink
            href={href}
            onClick={onClick}
            name={name}
            active={activePattern?.test(pathname())}
          >
            {icon}
          </TabLink>
        ))}
      </div>
      <div class="shrink-0 flex flex-col">
        {footerTabs.map(({ name, icon, href, activePattern, onClick }) => (
          <TabLink
            href={href}
            onClick={onClick}
            name={name}
            active={activePattern?.test(pathname())}
          >
            {icon}
          </TabLink>
        ))}
      </div>
    </nav>
  );
}
