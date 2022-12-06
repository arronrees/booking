import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';

type FormInputs = {
  name: string;
  email: string;
  telephone: string;
  password: string;
  age: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
  county: string;
  postcode: string;
  country: string;
};

type FormData = {
  user: {
    name: string;
    email: string;
    telephone: string;
    age: number;
    password: string;
    role: 'USER' | 'ADMIN';
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    town: string;
    county: string;
    postcode: string;
    country: string;
  };
};

export default function SignUpForm({}) {
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const router = useRouter();

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setGeneralError(null);
    setIsLoading(true);

    const formData: FormData = {
      user: {
        name: data.name,
        email: data.email,
        telephone: data.telephone,
        age: parseFloat(data.age),
        password: data.password,
        role: 'USER',
      },
      address: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        town: data.town,
        county: data.county,
        postcode: data.postcode,
        country: data.country,
      },
    };

    const res = await fetch('/api/auth/signup', {
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
      name: '',
      email: '',
      telephone: '',
      password: '',
      age: '',
      addressLine1: '',
      addressLine2: '',
      town: '',
      county: '',
      postcode: '',
      country: '',
    },
  });

  return (
    <form
      className='bg-white mx-auto max-w-xl p-6 rounded-md grid gap-2'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <p className='border-b mb-4 text-slate-800'>Your Details</p>

      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Name
        </label>
        <input
          type='text'
          id='name'
          {...register('name', { required: 'Name is required' })}
          className='form__input'
        />
      </div>
      {errors.name?.message && (
        <p className='form__error'>{errors.name?.message}</p>
      )}
      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Email
        </label>
        <input
          type='email'
          id='email'
          {...register('email', { required: 'Email is required' })}
          className='form__input'
        />
      </div>
      {errors.email?.message && (
        <p className='form__error'>{errors.email?.message}</p>
      )}
      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Telephone
        </label>
        <input
          type='text'
          id='telephone'
          {...register('telephone', { required: 'Telephone is required' })}
          className='form__input'
        />
      </div>
      {errors.telephone?.message && (
        <p className='form__error'>{errors.telephone?.message}</p>
      )}
      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Age
        </label>
        <input
          type='number'
          id='age'
          {...register('age', {
            required: 'Age is required',
            min: { value: 1, message: 'Age must be at least 1' },
          })}
          className='form__input'
        />
      </div>
      {errors.age?.message && (
        <p className='form__error'>{errors.age?.message}</p>
      )}
      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Password
        </label>
        <input
          type='password'
          id='password'
          {...register('password', { required: 'Password is required' })}
          className='form__input'
        />
      </div>
      {errors.password?.message && (
        <p className='form__error'>{errors.password?.message}</p>
      )}

      <p className='mt-6 border-b mb-4 text-slate-800'>Address</p>

      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Address Line 1
        </label>
        <input
          type='text'
          id='addressLine1'
          {...register('addressLine1', {
            required: 'Address Line 1 is required',
          })}
          className='form__input'
        />
      </div>
      {errors.addressLine1?.message && (
        <p className='form__error'>{errors.addressLine1?.message}</p>
      )}
      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Address Line 2
        </label>
        <input
          type='text'
          id='addressLine2'
          {...register('addressLine2')}
          className='form__input'
        />
      </div>
      {errors.addressLine2?.message && (
        <p className='form__error'>{errors.addressLine2?.message}</p>
      )}
      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Town
        </label>
        <input
          type='text'
          id='town'
          {...register('town', { required: 'Town is required' })}
          className='form__input'
        />
      </div>
      {errors.town?.message && (
        <p className='form__error'>{errors.town?.message}</p>
      )}
      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          County
        </label>
        <input
          type='text'
          id='county'
          {...register('county', { required: 'County is required' })}
          className='form__input'
        />
      </div>
      {errors.county?.message && (
        <p className='form__error'>{errors.county?.message}</p>
      )}
      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Postcode
        </label>
        <input
          type='text'
          id='postcode'
          {...register('postcode', { required: 'Postcode is required' })}
          className='form__input'
        />
      </div>
      {errors.postcode?.message && (
        <p className='form__error'>{errors.postcode?.message}</p>
      )}
      <div className='flex items-center gap-4'>
        <label htmlFor='email' className='form__label'>
          Country
        </label>
        <input
          type='text'
          id='country'
          {...register('country', { required: 'Country is required' })}
          className='form__input'
        />
      </div>
      {errors.country?.message && (
        <p className='form__error'>{errors.country?.message}</p>
      )}

      {generalError && <p className='form__error'>{generalError}</p>}

      <button
        type='submit'
        className='mt-4 btn btn--slate'
        disabled={isLoading}
      >
        Submit
      </button>
    </form>
  );
}
