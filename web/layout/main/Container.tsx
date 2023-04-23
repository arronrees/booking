type Props = {
  children?: string | JSX.Element | JSX.Element[];
};

export default function Container({ children }: Props) {
  return <div className='px-6 pb-6 tracking-wide'>{children}</div>;
}
