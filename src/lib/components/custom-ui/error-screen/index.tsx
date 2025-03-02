export interface ErrorScreenProps {
  item: Error | string;
}

export default function ErrorScreen(props: ErrorScreenProps) {
  return (
    <div class="w-full h-dvh flex flex-col items-center place-content-center">
      <span>{String(props.item)}</span>
    </div>
  );
}
