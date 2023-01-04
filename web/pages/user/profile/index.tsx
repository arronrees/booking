import { withSessionSsr } from '../../../utils/iron/withSession';
import Image from 'next/image';
import DashboardLink from '../../../components/profile/DashboardLink';
import Header from '../../../layout/main/Header';

export default function Profile() {
  return (
    <>
      <Header />
      <div className='grid lg:grid-cols-5 gap-4 overflow-hidden'>
        <section className='lg:col-span-3 p-8 flex flex-col justify-center lg:p-16 xl:px-[10%]'>
          <div className='max-w-2xl mx-auto w-full'>
            <h1 className='mb-8 text-3xl font-title lg:text-6xl'>
              Your Profile
            </h1>
            <div className='grid xs:grid-cols-2 md:gap-6 gap-4'>
              <DashboardLink colour='mid-blue' text='My Tickets' href='/' />
              <DashboardLink colour='mid-blue' text='Saved Events' href='/' />
              <DashboardLink colour='mid-blue' text='Dashboard' href='/' />
              <DashboardLink
                colour='mid-blue'
                text='My Details'
                href='/user/profile/update'
              />
              <DashboardLink
                colour='gold'
                text='Create Event'
                href='/user/events/create'
              />
              <DashboardLink
                colour='light-blue'
                text='My Events'
                href='/user/events/my-events'
              />
            </div>
          </div>
        </section>
        <section className='lg:col-span-2 w-full h-80 lg:h-full'>
          <figure>
            <Image src='/glasto.webp' fill alt='' />
          </figure>
        </section>
      </div>
    </>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    const user = req.session.user;

    if (!user || user === undefined) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  }
);
