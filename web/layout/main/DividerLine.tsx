type Props = {
  className?: string;
};

export default function DividerLine({ className }: Props) {
  return (
    <div className={className}>
      <div className='bg-grey w-full h-[2px]'></div>
    </div>
  );
}
