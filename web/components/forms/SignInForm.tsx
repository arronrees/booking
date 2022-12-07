import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';

type FormInputs = {
  email: string;
  password: string;
};

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const router = useRouter();

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setGeneralError(null);
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
        setGeneralError(responseData.error);
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
      className='w-full grid gap-3'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className='flex items-center gap-4'>
        <input
          type='email'
          placeholder='Email'
          {...register('email', { required: 'Email is required' })}
          className='form__input'
        />
      </div>
      {errors.email?.message && (
        <p className='form__error'>{errors.email?.message}</p>
      )}

      <div className='flex items-center gap-4'>
        <input
          type='password'
          placeholder='Password'
          {...register('password', { required: 'Password is required' })}
          className='form__input'
        />
      </div>
      {errors.password?.message && (
        <p className='form__error'>{errors.password?.message}</p>
      )}

      {generalError && <p className='form__error'>{generalError}</p>}

      <button
        type='submit'
        className='mt-4 btn btn--gold text-lg'
        disabled={isLoading}
      >
        Submit
      </button>
    </form>
  );
}
