import Link from 'next/link';
import { UserAdminRequestType } from '../../../constant-types';
import Container from '../../../layout/main/Container';
import DividerLine from '../../../layout/main/DividerLine';
import Header from '../../../layout/main/Header';
import { withSessionSsr } from '../../../utils/iron/withSession';

type Props = { adminRequest: UserAdminRequestType };

export default function ViewAdminRequestPage({ adminRequest }: Props) {
  return (
    <>
      <Header />

      <Container>
        {adminRequest.status === 'PENDING' ? (
          <AdminRequestPending />
        ) : adminRequest.status === 'DENIED' ? (
          <AdminRequestDenied adminRequest={adminRequest} />
        ) : adminRequest.status === 'APPROVED' ? (
          <AdminRequestApproved adminRequest={adminRequest} />
        ) : (
          ''
        )}
      </Container>
    </>
  );
}

function AdminRequestPending(): JSX.Element {
  return (
    <div>
      <h1 className='page__title'>
        Admin Request - <span className='text-light-blue-light'>PENDING</span>
      </h1>
      <p>
        Your admin request is currently being looked into. We will be in touch
        shortly.
      </p>
    </div>
  );
}

function AdminRequestDenied({
  adminRequest,
}: {
  adminRequest: UserAdminRequestType;
}): JSX.Element {
  if (!adminRequest.dateComplete) {
    return (
      <p>This request has not yet been completed, please check back later</p>
    );
  }

  const dateComplete = new Date(adminRequest.dateComplete);
  const dateInThreeMonths = new Date(
    dateComplete.setMonth(dateComplete.getMonth() + 3)
  );

  return (
    <div>
      <h1 className='page__title'>
        Admin Request - <span className='text-red'>DENIED</span>
      </h1>
      <p>
        Unfortunately, your requested to become an admin user was denied on{' '}
        {new Date(adminRequest.dateComplete).toDateString()}. You can request to
        be an admin again on {dateInThreeMonths.toDateString()}.
      </p>
    </div>
  );
}

function AdminRequestApproved({
  adminRequest,
}: {
  adminRequest: UserAdminRequestType;
}): JSX.Element {
  if (!adminRequest.dateComplete) {
    return (
      <p>This request has not yet been completed, please check back later</p>
    );
  }

  return (
    <div>
      <h1 className='page__title'>
        Admin Request - <span className='text-gold'>APPROVED</span>
      </h1>
      <p>
        Your requested to become an admin user was approved on{' '}
        {new Date(adminRequest.dateComplete).toDateString()}.
      </p>
      <DividerLine className='py-4' />
      <div className='flex gap-4'>
        <Link href='/events/create' className='btn btn--gold'>
          Create event
        </Link>
        <Link href='/user/profile' className='btn btn--blue'>
          View profile
        </Link>
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
    }

    if (!params || !params.id) {
      return {
        redirect: {
          destination: '/user/admin-requests',
          permanent: false,
        },
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin-request/${params.id}`,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    const requestData = await response.json();

    if (!response.ok) {
      return {
        redirect: {
          destination: '/user/admin-requests',
          permanent: false,
        },
      };
    }

    return {
      props: { adminRequest: requestData.data },
    };
  }
);
