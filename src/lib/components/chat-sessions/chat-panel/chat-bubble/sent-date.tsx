import { Component } from "solid-js";

export const SentDate: Component<{
  date: Date;
}> = (props) => {
  return (
    <span>{props.date.toLocaleString()}</span>
  );
}
