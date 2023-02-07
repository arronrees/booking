import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { AddressInterface, UserInterface } from '../../../constant-types';
import toast from 'react-hot-toast';

type FormInputs = {
  addressLine1: string;
  addressLine2?: string;
  town: string;
  county?: string;
  postcode: string;
  country: string;
};

type FormData = {
  address: {
    addressLine1: string;
    addressLine2?: string;
    town: string;
    county?: string;
    postcode: string;
    country: string;
  };
};

interface Props {
  address: AddressInterface;
  user: UserInterface;
}

export default function EditUserAddressForm({ address, user }: Props) {
  if (!user) return null;

  if (!address) {
    return <p>No address provided</p>;
  }

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    const formData: FormData = {
      address: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        town: data.town,
        county: data.county,
        postcode: data.postcode,
        country: data.country,
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/update-address`,
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
    console.log(responseData);

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
      toast.success('User address updated successfully');
      return router.push(router.asPath);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      town: address.town,
      county: address.county,
      postcode: address.postcode,
      country: address.country,
    },
  });

  return (
    <form
      className='w-full grid gap-4'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div>
        <label className='form__label' htmlFor='addressLine1'>
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
        {errors.addressLine1?.message && (
          <p className='form__error'>{errors.addressLine1?.message}</p>
        )}
      </div>

      <div>
        <label className='form__label' htmlFor='addressLine2'>
          Address Line 2
        </label>
        <input
          type='text'
          id='addressLine2'
          {...register('addressLine2')}
          className='form__input'
        />
        {errors.addressLine2?.message && (
          <p className='form__error'>{errors.addressLine2?.message}</p>
        )}
      </div>

      <div>
        <label className='form__label' htmlFor='town'>
          Town
        </label>
        <input
          type='text'
          id='town'
          {...register('town', {
            required: 'Town is required',
          })}
          className='form__input'
        />
        {errors.town?.message && (
          <p className='form__error'>{errors.town?.message}</p>
        )}
      </div>

      <div>
        <label className='form__label' htmlFor='county'>
          County
        </label>
        <input
          type='text'
          id='county'
          {...register('county')}
          className='form__input'
        />
        {errors.county?.message && (
          <p className='form__error'>{errors.county?.message}</p>
        )}
      </div>

      <div>
        <label className='form__label' htmlFor='postcode'>
          Postcode
        </label>
        <input
          type='text'
          id='postcode'
          {...register('postcode', {
            required: 'Postcode is required',
          })}
          className='form__input'
        />
        {errors.postcode?.message && (
          <p className='form__error'>{errors.postcode?.message}</p>
        )}
      </div>

      <div>
        <label className='form__label' htmlFor='country'>
          Country
        </label>
        <input
          type='text'
          id='country'
          {...register('country', {
            required: 'Country is required',
          })}
          className='form__input'
        />
        {errors.country?.message && (
          <p className='form__error'>{errors.country?.message}</p>
        )}
      </div>

      <button type='submit' className='btn btn--blue' disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
