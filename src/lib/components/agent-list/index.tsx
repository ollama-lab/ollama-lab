import { Component } from "solid-js";
import { HeaderBar } from "../custom-ui/header-bar";

export const AgentList: Component = () => {
  return (
    <div class="w-full h-full flex flex-col">
      <HeaderBar title="Agents" />

      <div class="flex flex-col grow">
      </div>
    </div>
  );
};
