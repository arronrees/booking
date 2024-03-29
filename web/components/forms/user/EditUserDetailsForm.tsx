import { useState } from 'react';
import { UserInterface } from '../../../constant-types';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormInputs = {
  name: string;
  telephone: string;
  age: number;
};

type FormData = {
  user: {
    name: string;
    telephone: string;
    age: number;
  };
};

interface Props {
  user: UserInterface;
}

export default function UpdateUserDetailsForm({ user }: Props) {
  if (!user) return null;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: user.name,
      telephone: user.telephone,
      age: Number(user.age),
    },
  });

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    const formData: FormData = {
      user: {
        name: data.name,
        telephone: data.telephone,
        age: Number(data.age),
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/update`,
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
        toast.success(userData.error);
        return;
      }

      setIsLoading(false);
      toast.success('User details updated successfully');
      return router.push(router.asPath);
    }
  };

  return (
    <form
      className='w-full grid gap-4'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div>
        <label className='form__label' htmlFor='name'>
          Full Name
        </label>
        <input
          type='text'
          id='name'
          placeholder='Name'
          {...register('name', { required: 'Name is required' })}
          className='form__input'
        />
        {errors.name?.message && (
          <p className='form__error'>{errors.name?.message}</p>
        )}
      </div>

      <div>
        <label className='form__label' htmlFor='telephone'>
          Telephone
        </label>
        <input
          type='text'
          id='telephone'
          placeholder='Telephone'
          {...register('telephone', { required: 'Telephone is required' })}
          className='form__input'
        />
        {errors.telephone?.message && (
          <p className='form__error'>{errors.telephone?.message}</p>
        )}
      </div>

      <div>
        <label className='form__label' htmlFor='age'>
          Age
        </label>
        <input
          type='number'
          id='age'
          placeholder='Age'
          {...register('age', { required: 'Age is required' })}
          className='form__input'
        />
        {errors.age?.message && (
          <p className='form__error'>{errors.age?.message}</p>
        )}
      </div>

      <button
        type='submit'
        className='
        btn btn--blue'
        disabled={isLoading}
      >
        Submit
      </button>
    </form>
  );
}
