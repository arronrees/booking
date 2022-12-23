import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { EventInterfaceCompact } from '../../../constant-types';
import toast from 'react-hot-toast';

type FormInputs = {
  name: string;
  description: string;
  date: Date | string;
  public: boolean;
  type: EventType;
  maxBookings: number;
  location: string;
};

enum EventType {
  MUSIC = 'MUSIC',
  FESTIVAL = 'FESTIVAL',
  THEATRE = 'THEATRE',
  SPORT = 'SPORT',
  COMEDY = 'COMEDY',
  OTHER = 'OTHER',
}

type FormData = {
  event: {
    name: string;
    description: string;
    date: Date;
    public: boolean;
    type: EventType;
    maxBookings: number;
    location: string;
  };
};

interface Props {
  event: EventInterfaceCompact;
}

export default function EditEventForm({ event }: Props) {
  if (!event) {
    return <p>Error: No event passed to form</p>;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const router = useRouter();

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setGeneralError(null);
    setIsLoading(true);

    const formData: FormData = {
      event: {
        name: data.name,
        description: data.description,
        date: new Date(data.date),
        public: data.public,
        type: data.type,
        maxBookings: data.maxBookings,
        location: data.location,
      },
    };

    console.log(formData.event);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/update/${event.id}`,
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
      toast.success('Event updated successfully');
      router.push(router.asPath);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: event.name,
      description: event.description,
      date: new Date(event.date)
        .toLocaleDateString()
        .split('/')
        .reverse()
        .join('-'),
      public: event.public,
      type: event.type,
      maxBookings: event.maxBookings,
      location: event.location,
    },
  });

  return (
    <form
      className='w-full grid gap-4 md:grid-cols-2'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <p className='font-title text-xl xs:col-span-2 text-gold'>
        Event Details
      </p>

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
      <div className='md:col-span-2'>
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
          Date
        </label>
        <input
          type='date'
          id='date'
          placeholder='Date'
          {...register('date', { required: 'Date is required' })}
          className='form__input'
        />
        {errors.date?.message && (
          <p className='form__error'>{errors.date?.message}</p>
        )}
      </div>
      <div className='md:col-span-2 flex items-center'>
        <label className='form__label' htmlFor='public'>
          Public?
        </label>
        <input
          type='checkbox'
          id='public'
          {...register('public')}
          className='form__checkbox'
        />
        {errors.public?.message && (
          <p className='form__error'>{errors.public?.message}</p>
        )}
      </div>
      <div>
        <label className='form__label' htmlFor='type'>
          Type
        </label>
        <select
          id='type'
          {...register('type', { required: 'Type is required' })}
          className='form__input'
        >
          <option value='MUSIC'>Music</option>
          <option value='FESTIVAL'>Festival</option>
          <option value='THEATRE'>Theatre</option>
          <option value='SPORT'>Sport</option>
          <option value='COMEDY'>Comedy</option>
          <option value='OTHER'>Other</option>
        </select>
        {errors.type?.message && (
          <p className='form__error'>{errors.type?.message}</p>
        )}
      </div>
      <div>
        <label className='form__label' htmlFor='maxBookings'>
          Max Bookings
        </label>
        <input
          type='number'
          id='maxBookings'
          placeholder='maxBookings'
          {...register('maxBookings', { required: 'Max Bookings is required' })}
          className='form__input'
        />
        {errors.maxBookings?.message && (
          <p className='form__error'>{errors.maxBookings?.message}</p>
        )}
      </div>
      <div>
        <label className='form__label' htmlFor='location'>
          Location
        </label>
        <input
          type='text'
          id='location'
          placeholder='Location'
          {...register('location', { required: 'Location is required' })}
          className='form__input'
        />
        {errors.location?.message && (
          <p className='form__error'>{errors.location?.message}</p>
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
