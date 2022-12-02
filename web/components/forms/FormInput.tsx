import { FormEvent } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  className?: string;
  type?: string;
  value?: string | number;
  onChange?(e: FormEvent): any;
}

export default function FormInput({
  label,
  name,
  className,
  type,
  value,
  onChange,
}: FormInputProps) {
  return (
    <div className='flex flex-col'>
      <label htmlFor='email' className='block text-slate-400'>
        {label}
      </label>
      <input
        type={type ? type : 'text'}
        id={name}
        name={name}
        className={`border block w-full flex-1 rounded border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 ${className}`}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
