import { JSX } from "solid-js";
import { MetaProvider } from "@solidjs/meta";

export default function Providers(props: { children?: JSX.Element }) {
  return (
    <MetaProvider>
      {props.children}
    </MetaProvider>
  );
}
