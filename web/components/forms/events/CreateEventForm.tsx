import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { UserInterface } from '../../../constant-types';

type FormInputs = {
  name: string;
  description: string;
  date: Date | string;
  public: boolean;
  type: EventType;
  maxBookings: number;
  location: string;
  addressLine1: string;
  addressLine2?: string;
  town: string;
  county?: string;
  postcode: string;
  country: string;
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
  user: UserInterface;
}

export default function EditEventForm({ user }: Props) {
  if (!user) {
    return <p>Error: No user</p>;
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
        maxBookings: Number(data.maxBookings),
        location: data.location,
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

    console.log(formData);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/create/${user.id}`,
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
    console.log(responseData);

    if (!res.ok) {
      if (responseData.error && typeof responseData.error === 'string') {
        toast.error(responseData.error);
        setGeneralError(responseData.error);
      }
    }

    if (res.ok) {
      setIsLoading(false);
      toast.success('Event created successfully');
      router.push('/events');
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
      date: new Date(),
      public: true,
      maxBookings: 0,
      location: '',
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

      <p className='font-title text-xl xs:col-span-2 text-gold'>
        Event Address Details
      </p>

      <div>
        <label className='form__label' htmlFor='addressLine1'>
          Address Line 1
        </label>
        <input
          type='text'
          id='addressLine1'
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
        <label className='form__label' htmlFor='addressLine2'>
          Address Line 2
        </label>
        <input
          type='text'
          id='addressLine2'
          placeholder='Address Line 2'
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
          placeholder='Town'
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
          placeholder='County'
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
          placeholder='Postcode'
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
          placeholder='Country'
          {...register('country', {
            required: 'Country is required',
          })}
          className='form__input'
        />
        {errors.country?.message && (
          <p className='form__error'>{errors.country?.message}</p>
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
