import { useState, FormEvent } from 'react';
import FormInput from '../../components/forms/FormInput';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [town, setTown] = useState('');
  const [county, setCounty] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();

    const formData = {
      user: {
        name,
        email,
        telephone,
        age,
        password,
      },
      address: {
        addressLine1,
        addressLine2,
        town,
        county,
        postcode,
        country,
      },
    };
    console.log(formData);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    console.log(data);
  }

  return (
    <div className='p-10'>
      <h1 className='text-center mb-6 text-6xl'>Sign Up</h1>

      <form
        className='bg-white text-slate-800 mx-auto max-w-xl p-6 rounded-md grid gap-2'
        onSubmit={handleFormSubmit}
      >
        <p className='border-b mb-4 text-slate-800'>Your Details</p>
        <FormInput
          label='Name'
          name='name'
          onChange={(e) => setName((e.target as HTMLInputElement).value)}
        />
        <FormInput
          label='Email'
          name='email'
          type='email'
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
        <FormInput
          label='Telephone'
          name='telephone'
          onChange={(e) => setTelephone((e.target as HTMLInputElement).value)}
        />
        <FormInput
          label='Age'
          name='age'
          onChange={(e) => setAge((e.target as HTMLInputElement).value)}
        />
        <FormInput
          label='Password'
          name='password'
          type='password'
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
        />
        <p className='mt-6 border-b mb-4 text-slate-800'>Address</p>
        <FormInput
          label='Address Line 1'
          name='addressLine1'
          onChange={(e) =>
            setAddressLine1((e.target as HTMLInputElement).value)
          }
        />
        <FormInput
          label='Address Line 2'
          name='addressLine2'
          onChange={(e) =>
            setAddressLine2((e.target as HTMLInputElement).value)
          }
        />
        <FormInput
          label='Town'
          name='town'
          onChange={(e) => setTown((e.target as HTMLInputElement).value)}
        />
        <FormInput
          label='County'
          name='county'
          onChange={(e) => setCounty((e.target as HTMLInputElement).value)}
        />
        <FormInput
          label='Postcode'
          name='postcode'
          onChange={(e) => setPostcode((e.target as HTMLInputElement).value)}
        />
        <FormInput
          label='Country'
          name='country'
          onChange={(e) => setCountry((e.target as HTMLInputElement).value)}
        />

        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}
