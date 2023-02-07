import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import DividerLine from '../../layout/main/DividerLine';

type FormInputs = {
  email: string;
  password: string;
};

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    const formData = {
      user: {
        email: data.email,
        password: data.password,
      },
    };

    console.log(formData);

    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const responseData = await res.json();
    console.log(responseData);

    if (!res.ok) {
      if (responseData.error && typeof responseData.error === 'string') {
        toast.error(responseData.error);
        setIsLoading(false);
        return;
      }
    }

    if (res.ok) {
      router.push('/');
    }

    setIsLoading(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form
      className='w-full grid gap-4'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div>
        <label htmlFor='email' className='form__label'>
          Email
        </label>
        <input
          type='email'
          id='email'
          placeholder='elton.john@gmail.com'
          {...register('email', { required: 'Email is required' })}
          className='form__input'
        />
        {errors.email?.message && (
          <p className='form__error'>{errors.email?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='password' className='form__label'>
          Password
        </label>
        <input
          type='password'
          id='password'
          placeholder='Password'
          {...register('password', { required: 'Password is required' })}
          className='form__input'
        />
        {errors.password?.message && (
          <p className='form__error'>{errors.password?.message}</p>
        )}
      </div>

      <DividerLine />

      <button type='submit' className='btn btn--gold' disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
