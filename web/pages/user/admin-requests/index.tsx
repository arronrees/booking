import Link from 'next/link';
import {
  JsonApiResponseType,
  UserAdminRequestType,
  UserInterface,
} from '../../../constant-types';
import DividerLine from '../../../layout/main/DividerLine';
import Header from '../../../layout/main/Header';
import { withSessionSsr } from '../../../utils/iron/withSession';
import useUser from '../../../utils/iron/useUser';

type Props = { adminRequests?: UserAdminRequestType[] };

export default function AdminRequests({ adminRequests }: Props) {
  const { user }: { user: UserInterface } = useUser();

  return (
    <>
      <Header />

      <section className='px-6'>
        <div>
          <h1 className='page__title'>Admin Requests</h1>
          <p>See below your previous admin requests.</p>
        </div>
        <DividerLine className='py-4' />
        <div className='grid gap-2'>
          {adminRequests &&
            adminRequests.map((request) => (
              <Link
                href={`/user/admin-requests/${request.id}`}
                key={request.id}
                className='bg-dark-blue rounded p-4'
              >
                <p>Status: {request.status}</p>
              </Link>
            ))}
        </div>
        {user && user.role === 'USER' && (
          <>
            <DividerLine className='py-4' />
            <div>
              <Link href='/user/become-an-admin' className='btn btn--blue'>
                Become and Admin
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res, params }) {
    const user = req.session.user;

    if (!user || user === undefined) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    } else {
      const adminRequestsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin-request`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (adminRequestsRes.ok) {
        const adminRequestsData: JsonApiResponseType =
          await adminRequestsRes.json();

        return {
          props: { user, adminRequests: adminRequestsData.data },
        };
      } else {
        return { props: { user } };
      }
    }
  }
);
