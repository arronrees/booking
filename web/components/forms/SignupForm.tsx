import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import DividerLine from '../../layout/main/DividerLine';

type FormInputs = {
  name: string;
  email: string;
  telephone: string;
  password: string;
  passwordConfirmation: string;
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
    passwordConfirmation: string;
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

  const router = useRouter();

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    const formData: FormData = {
      user: {
        name: data.name,
        email: data.email,
        telephone: data.telephone,
        age: parseFloat(data.age),
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
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
        toast.error(responseData.error);
        setIsLoading(false);
        return;
      }
    }

    if (res.ok) {
      router.push('/user/signup-confirmation');
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
      passwordConfirmation: '',
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
      className='w-full grid gap-4'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className=''>
        <label htmlFor='name' className='form__label'>
          Full Name
        </label>
        <input
          type='text'
          placeholder='Elton John'
          id='name'
          {...register('name', { required: 'Full Name is required' })}
          className='form__input'
        />
        {errors.name?.message && (
          <p className='form__error'>{errors.name?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='email' className='form__label'>
          Email
        </label>
        <input
          type='email'
          placeholder='elton.john@gmail.com'
          id='email'
          {...register('email', { required: 'Email is required' })}
          className='form__input'
        />
        {errors.email?.message && (
          <p className='form__error'>{errors.email?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='telephone' className='form__label'>
          Telephone
        </label>
        <input
          type='text'
          placeholder='01935 477073'
          id='telephone'
          {...register('telephone', { required: 'Telephone is required' })}
          className='form__input'
        />
        {errors.telephone?.message && (
          <p className='form__error'>{errors.telephone?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='age' className='form__label'>
          Age
        </label>
        <input
          type='number'
          placeholder='24'
          id='age'
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

      <DividerLine />

      <div>
        <label htmlFor='addressLine1' className='form__label'>
          Address Line 1
        </label>
        <input
          type='text'
          placeholder='Goodbye Yellow'
          id='addressLine1'
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
        <label htmlFor='addressLine2' className='form__label'>
          Address Line 2
        </label>
        <input
          type='text'
          placeholder='Brick Road'
          id='addressLine2'
          {...register('addressLine2')}
          className='form__input'
        />
        {errors.addressLine2?.message && (
          <p className='form__error'>{errors.addressLine2?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='town' className='form__label'>
          Town/City
        </label>
        <input
          type='text'
          placeholder='Yeovil'
          id='town'
          {...register('town', { required: 'Town is required' })}
          className='form__input'
        />
        {errors.town?.message && (
          <p className='form__error'>{errors.town?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='county' className='form__label'>
          County
        </label>
        <input
          type='text'
          placeholder='Somerset'
          id='county'
          {...register('county', { required: 'County is required' })}
          className='form__input'
        />
        {errors.county?.message && (
          <p className='form__error'>{errors.county?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='postcode' className='form__label'>
          Postcode
        </label>
        <input
          type='text'
          placeholder='BA21 5EA'
          id='postcode'
          {...register('postcode', { required: 'Postcode is required' })}
          className='form__input'
        />
        {errors.postcode?.message && (
          <p className='form__error'>{errors.postcode?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='country' className='form__label'>
          Country
        </label>
        <input
          type='text'
          placeholder='UK'
          id='country'
          {...register('country', { required: 'Country is required' })}
          className='form__input'
        />
        {errors.country?.message && (
          <p className='form__error'>{errors.country?.message}</p>
        )}
      </div>

      <DividerLine />

      <div>
        <label htmlFor='password' className='form__label'>
          Password
        </label>
        <input
          type='password'
          id='password'
          {...register('password', { required: 'Password is required' })}
          className='form__input'
        />
        {errors.password?.message && (
          <p className='form__error'>{errors.password?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='passwordConfirmation' className='form__label'>
          Password Confirmation
        </label>
        <input
          type='password'
          id='passwordConfirmation'
          {...register('passwordConfirmation', {
            required: 'Password Confirmation is required',
          })}
          className='form__input'
        />
        {errors.passwordConfirmation?.message && (
          <p className='form__error'>{errors.passwordConfirmation?.message}</p>
        )}
      </div>

      <DividerLine />

      <button type='submit' className='btn btn--gold' disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
