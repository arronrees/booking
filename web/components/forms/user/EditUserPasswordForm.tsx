import { useState } from 'react';
import { UserInterface } from '../../../constant-types';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormInputs = {
  password: string;
  passwordConfirmation: string;
};

type FormData = {
  user: {
    password: string;
    passwordConfirmation: string;
  };
};

interface Props {
  user: UserInterface;
}

export default function EditUserPasswordForm({ user }: Props) {
  if (!user) return null;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    const formData: FormData = {
      user: {
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/update-password/${user.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer: ${user.token}`,
        },
        body: JSON.stringify(formData),
      }
    );
    const responseData = await res.json();

    if (!res.ok) {
      if (responseData.error && typeof responseData.error === 'string') {
        toast.error(responseData.error);
        setIsLoading(false);
        return;
      }
    }

    if (res.ok) {
      // update user session
      const userRes = await fetch('/api/user/update');
      const userData = await userRes.json();

      if (!userRes.ok) {
        setIsLoading(false);
        toast.error(userData.error);
        return;
      }

      setIsLoading(false);
      toast.success('User updated successfully');
      return router.push(router.asPath);
    }
  };

  return (
    <form
      className='w-full grid gap-4 md:grid-cols-2'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <p className='font-title text-xl xs:col-span-2 text-gold'>User Email</p>

      <div>
        <label className='form__label' htmlFor='name'>
          Name
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

      <div>
        <label className='form__label' htmlFor='name'>
          Name
        </label>
        <input
          type='password'
          id='passwordConfirmation'
          placeholder='Password Confirmation'
          {...register('passwordConfirmation', {
            required: 'Password Confirmation is required',
          })}
          className='form__input'
        />
        {errors.passwordConfirmation?.message && (
          <p className='form__error'>{errors.passwordConfirmation?.message}</p>
        )}
      </div>

      <button
        type='submit'
        className='mt-4 btn btn--lblue text-lg md:col-span-2'
        disabled={isLoading}
      >
        Submit
      </button>
    </form>
  );
}
