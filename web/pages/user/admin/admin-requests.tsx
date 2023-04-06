import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import {
  JsonApiResponseType,
  UserAdminRequestType,
  UserInterface,
} from '../../../constant-types';
import DividerLine from '../../../layout/main/DividerLine';
import Header from '../../../layout/main/Header';
import useUser from '../../../utils/iron/useUser';
import { withSessionSsr } from '../../../utils/iron/withSession';

type Props = { adminRequests?: UserAdminRequestType[] };

export default function AdminRequestsForVerification({ adminRequests }: Props) {
  return (
    <>
      <Header />

      <section className='px-6'>
        <div>
          <h1 className='page__title'>Admin Verification Requests</h1>
          <p>
            {!adminRequests ||
              (adminRequests.length === 0 &&
                'There are currently no admin requests for you to review.')}
            {adminRequests &&
              adminRequests.length > 0 &&
              `There are currently ${adminRequests.length}
                admin verification requests. Please review and action each request
                below.`}
          </p>
        </div>
        <DividerLine className='py-4' />
        <div className='grid gap-2'>
          {adminRequests &&
            adminRequests.map((request) => (
              <AdminRequestBox adminRequest={request} key={request.id} />
            ))}
        </div>
      </section>
    </>
  );
}

export function AdminRequestBox({
  adminRequest,
}: {
  adminRequest: UserAdminRequestType;
}) {
  const { user }: { user: UserInterface } = useUser();

  const router = useRouter();

  if (!user) return null;

  const handleApproveBtnClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/admin-requests/${adminRequest.id}?result=approve`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer: ${user.token}`,
        },
      }
    );
    const data: JsonApiResponseType = await res.json();

    if (res.ok) {
      toast.success('Request approved successfully');
      router.push(router.asPath);
      return;
    } else {
      toast.error(data.error || 'Error processing approval');
      router.push(router.asPath);
      return;
    }
  };

  const handleDenyBtnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/admin-requests/${adminRequest.id}?result=deny`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer: ${user.token}`,
        },
      }
    );
    const data: JsonApiResponseType = await res.json();

    if (res.ok) {
      toast.success('Request denied successfully');
      router.push(router.asPath);
      return;
    } else {
      toast.error(data.error || 'Error processing denial');
      router.push(router.asPath);
      return;
    }
  };

  return (
    <div className='bg-dark-blue rounded p-4'>
      <p className='mb-2 font-semibold text-xl'>{adminRequest.User?.name}</p>
      <p className='mb-4 text-sm'>
        Requested on {new Date(adminRequest.createdAt).toDateString()}
      </p>
      <div className='flex gap-4'>
        <button
          type='button'
          className='btn btn--gold'
          onClick={handleApproveBtnClick}
        >
          Approve
        </button>
        <button
          type='button'
          className='btn btn--red'
          onClick={handleDenyBtnClick}
        >
          Deny
        </button>
      </div>
    </div>
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
    } else if (user.role !== 'SUPERADMIN') {
      return {
        redirect: {
          destination: '/user/profile',
          permanent: false,
        },
      };
    } else {
      const adminRequestsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/admin-requests`,
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
