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

export default function SignUpForm() {
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
      className='w-full grid gap-3 xs:grid-cols-2'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <p className='font-title xs:col-span-2 text-gray-300'>Your Details</p>

      <div>
        <input
          type='text'
          placeholder='Name'
          {...register('name', { required: 'Name is required' })}
          className='form__input'
        />
        {errors.name?.message && (
          <p className='form__error'>{errors.name?.message}</p>
        )}
      </div>
      <div>
        <input
          type='email'
          placeholder='Email'
          {...register('email', { required: 'Email is required' })}
          className='form__input'
        />
        {errors.email?.message && (
          <p className='form__error'>{errors.email?.message}</p>
        )}
      </div>
      <div>
        <input
          type='text'
          placeholder='Telephone'
          {...register('telephone', { required: 'Telephone is required' })}
          className='form__input'
        />
        {errors.telephone?.message && (
          <p className='form__error'>{errors.telephone?.message}</p>
        )}
      </div>
      <div>
        <input
          type='number'
          placeholder='Age'
          {...register('age', {
            required: 'Age is required',
            min: { value: 1, message: 'Age must be at least 1' },
          })}
          className='form__input'
        />
        {errors.age?.message && (
          <p className='form__error'>{errors.age?.message}</p>
        )}
      </div>
      <div>
        <input
          type='password'
          placeholder='Password'
          {...register('password', { required: 'Password is required' })}
          className='form__input'
        />
        {errors.password?.message && (
          <p className='form__error'>{errors.password?.message}</p>
        )}
      </div>

      <p className='mt-4 font-title xs:col-span-2 text-gray-300'>Address</p>

      <div>
        <input
          type='text'
          placeholder='Address Line 1'
          {...register('addressLine1', {
            required: 'Address Line 1 is required',
          })}
          className='form__input'
        />
        {errors.addressLine1?.message && (
          <p className='form__error'>{errors.addressLine1?.message}</p>
        )}
      </div>
      <div>
        <input
          type='text'
          placeholder='Address Line 2'
          {...register('addressLine2')}
          className='form__input'
        />
        {errors.addressLine2?.message && (
          <p className='form__error'>{errors.addressLine2?.message}</p>
        )}
      </div>
      <div>
        <input
          type='text'
          placeholder='Town'
          {...register('town', { required: 'Town is required' })}
          className='form__input'
        />
        {errors.town?.message && (
          <p className='form__error'>{errors.town?.message}</p>
        )}
      </div>
      <div>
        <input
          type='text'
          placeholder='County'
          {...register('county', { required: 'County is required' })}
          className='form__input'
        />
        {errors.county?.message && (
          <p className='form__error'>{errors.county?.message}</p>
        )}
      </div>
      <div>
        <input
          type='text'
          placeholder='Postcode'
          {...register('postcode', { required: 'Postcode is required' })}
          className='form__input'
        />
        {errors.postcode?.message && (
          <p className='form__error'>{errors.postcode?.message}</p>
        )}
      </div>
      <div>
        <input
          type='text'
          placeholder='Country'
          {...register('country', { required: 'Country is required' })}
          className='form__input'
        />
        {errors.country?.message && (
          <p className='form__error'>{errors.country?.message}</p>
        )}
      </div>

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
