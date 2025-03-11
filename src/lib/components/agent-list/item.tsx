import { Component } from "solid-js";
import { Agent } from "~/lib/models/agent";

export const AgentListItem: Component<{
  agent: Agent,
}> = (props) => {
  const name = () => props.agent.name;

  return (
    <div>
      {name()}
    </div>
  );
};
