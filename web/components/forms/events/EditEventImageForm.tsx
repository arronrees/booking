import { useState } from 'react';
import { useRouter } from 'next/router';
import { UserInterface } from '../../../constant-types';
import toast from 'react-hot-toast';
import useUser from '../../../utils/iron/useUser';

interface Props {
  eventId: string;
}

export default function EditEventImageForm({ eventId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { user }: { user: UserInterface } = useUser();

  const [eventImageFile, setEventImageFile] = useState<File>();

  if (!user) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (eventImageFile) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append('eventImageFile', eventImageFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/update-image/${eventId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
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
        setIsLoading(false);
        toast.success('Event image updated successfully');
        router.push(router.asPath);
        return;
      }
    } else {
      toast.error('No file selected');
      return;
    }
  };

  return (
    <form className='w-full grid gap-4' onSubmit={handleFormSubmit}>
      <p className='font-title text-xl text-gold'>Upload New Event Image</p>

      <div>
        <label className='form__label' htmlFor='name'>
          Image file
        </label>
        <input
          type='file'
          id='name'
          placeholder='Name'
          className='form__input'
          onChange={(e) => {
            if (e.target.files) {
              setEventImageFile(e.target.files[0]);
            }
          }}
        />
      </div>

      <button
        type='submit'
        className='mt-4 btn btn--lblue text-lg'
        disabled={isLoading}
      >
        Submit
      </button>
    </form>
  );
}
