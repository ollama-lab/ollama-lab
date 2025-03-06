export interface SentDateProps {
  date: Date;
}

export function SentDate(props: SentDateProps) {
  return (
    <span>{props.date.toLocaleString()}</span>
  );
}
