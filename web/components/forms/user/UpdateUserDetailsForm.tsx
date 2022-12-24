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
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const router = useRouter();

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setGeneralError(null);
    setIsLoading(true);

    const formData: FormData = {
      user: {
        name: data.name,
        telephone: data.telephone,
        age: Number(data.age),
      },
    };

    console.log(formData);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/update/${user.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }
    );
    const responseData = await res.json();
    console.log(responseData);

    if (!res.ok) {
      if (responseData.error && typeof responseData.error === 'string') {
        toast.error(responseData.error);
        setGeneralError(responseData.error);
      }
    }

    if (res.ok) {
      setIsLoading(false);
      toast.success('User updated successfully');
      router.push(router.asPath);
    }
  };

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

  return (
    <form
      className='w-full grid gap-4 md:grid-cols-2'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <p className='font-title text-xl xs:col-span-2 text-gold'>User Details</p>

      <div>
        <label className='form__label' htmlFor='name'>
          Name
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
        <label className='form__label' htmlFor='name'>
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
        <label className='form__label' htmlFor='name'>
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

      {generalError && <p className='form__error'>{generalError}</p>}

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
