import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { UserInterface } from '../../../constant-types';
import useUser from '../../../utils/iron/useUser';
import DividerLine from '../../../layout/main/DividerLine';

type FormInputs = {
  name: string;
  description: string;
  date: Date | string;
  public: boolean | 'true' | 'false';
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

export default function EditEventForm() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

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

  const { user }: { user: UserInterface } = useUser();

  if (!user) return null;

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    const formData: FormData = {
      event: {
        name: data.name,
        description: data.description,
        date: new Date(data.date),
        public: data.public == 'true' ? true : false,
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

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/create`,
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
      toast.success('Event created successfully');
      return router.push(`/user/events/edit/${responseData.data.id}`);
    }
  };

  return (
    <form
      className='w-full grid gap-4'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div>
        <p className='page__title'>Event Details</p>
        <DividerLine className='pb-4' />

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
        <label className='form__label' htmlFor='public'>
          Make Public?
        </label>
        <select id='public' {...register('public')} className='form__input'>
          <option value='false'>No</option>
          <option value='true'>Yes</option>
        </select>
        {errors.public?.message && (
          <p className='form__error'>{errors.public?.message}</p>
        )}
      </div>

      <div>
        <p className='page__title'>Address Details</p>
        <DividerLine className='pb-4' />

        <label className='form__label' htmlFor='addressLine1'>
          Address Line 1
        </label>
        <input
          type='text'
          id='addressLine1'
          placeholder='Goodbye Yellow'
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
          placeholder='Brick Road'
          {...register('addressLine2')}
          className='form__input'
        />
        {errors.addressLine2?.message && (
          <p className='form__error'>{errors.addressLine2?.message}</p>
        )}
      </div>
      <div>
        <label className='form__label' htmlFor='town'>
          Town/City
        </label>
        <input
          type='text'
          id='town'
          placeholder='Yeovil'
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
          placeholder='Somerset'
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
          placeholder='BA21 5EA'
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
          placeholder='UK'
          {...register('country', {
            required: 'Country is required',
          })}
          className='form__input'
        />
        {errors.country?.message && (
          <p className='form__error'>{errors.country?.message}</p>
        )}
      </div>

      <button type='submit' className='btn btn--gold' disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
