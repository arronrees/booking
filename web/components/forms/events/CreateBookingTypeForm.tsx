import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { UserInterface } from '../../../constant-types';

type FormInputs = {
  name: string;
  description: string;
  price: number;
  maxBookings: number;
};

type FormData = {
  bookingType: {
    name: string;
    description: string;
    price: number;
    maxBookings: number;
  };
};

interface Props {
  user: UserInterface;
  eventId: string;
}

export default function CreateBookingTypeForm({ user, eventId }: Props) {
  if (!user) return null;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    const formData: FormData = {
      bookingType: {
        name: data.name,
        description: data.description,
        maxBookings: Number(data.maxBookings),
        price: Number(data.price),
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookingtype/create/${eventId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
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
      setIsLoading(false);
      toast.success('Booking Type created successfully');
      return router.push(router.asPath);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      maxBookings: 0,
    },
  });

  return (
    <form
      className='w-full grid gap-4'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
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
        <label className='form__label' htmlFor='description'>
          Description
        </label>
        <textarea
          id='description'
          placeholder='Description'
          {...register('description', { required: 'Description is required' })}
          className='form__input'
        ></textarea>
        {errors.description?.message && (
          <p className='form__error'>{errors.description?.message}</p>
        )}
      </div>

      <div>
        <label className='form__label' htmlFor='date'>
          Price
        </label>
        <input
          type='number'
          id='price'
          placeholder='Price'
          min={0}
          step='0.01'
          {...register('price', { required: 'Price is required' })}
          className='form__input'
        />
        {errors.price?.message && (
          <p className='form__error'>{errors.price?.message}</p>
        )}
      </div>

      <div>
        <label className='form__label' htmlFor='maxBookings'>
          Max Bookings
        </label>
        <input
          type='number'
          id='maxBookings'
          min={0}
          placeholder='Max Bookings'
          {...register('maxBookings', { required: 'Max Bookings is required' })}
          className='form__input'
        />
        {errors.maxBookings?.message && (
          <p className='form__error'>{errors.maxBookings?.message}</p>
        )}
      </div>

      <button type='submit' className='btn btn--gold' disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
