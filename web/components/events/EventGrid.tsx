type Props = {
  children?: string | JSX.Element | JSX.Element[];
};

export default function EventGrid({ children }: Props) {
  return <section className='grid gap-4 grid-cols-2'>{children}</section>;
}
