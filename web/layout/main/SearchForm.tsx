import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchForm() {
  return (
    <form className='px-4 rounded-md border items-center ml-auto hidden xs:flex'>
      <input
        type='text'
        placeholder='Search for events'
        className='bg-transparent border-none placeholder:text-white placeholder:text-lg text-lg'
      />
      <button type='submit'>
        <MagnifyingGlassIcon className='w-6 h-6' />
      </button>
    </form>
  );
}
