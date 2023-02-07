import { useState } from 'react';
import { UserInterface } from '../../../constant-types';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormInputs = {
  email: string;
};

type FormData = {
  user: {
    email: string;
  };
};

interface Props {
  user: UserInterface;
}

export default function EditUserEmailForm({ user }: Props) {
  if (!user) return null;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      email: user.email,
    },
  });

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    const formData: FormData = {
      user: {
        email: data.email,
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/update-email`,
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
      toast.success(
        'User email updated successfully, please verify your email.'
      );
      return router.push(router.asPath);
    }
  };

  return (
    <form
      className='w-full grid gap-4'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div>
        <label className='form__label' htmlFor='email'>
          Email
        </label>
        <input
          type='email'
          id='email'
          placeholder='Email'
          {...register('email', { required: 'Email is required' })}
          className='form__input'
        />
        {errors.email?.message && (
          <p className='form__error'>{errors.email?.message}</p>
        )}
      </div>

      <button type='submit' className='btn btn--blue' disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
