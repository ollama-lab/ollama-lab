import { Section } from "~/lib/models/section"
import { BotMessageSquareIcon, PackageIcon, SettingsIcon } from "lucide-solid"

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
  return (
    <nav class="flex flex-col border-r border-border px-1 py-1">
      <div class="grow flex flex-col">
      </div>
    </nav>
  );
}
