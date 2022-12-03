import { withSessionSsr } from '../utils/iron/withSession';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1>Home</h1>
      <button
        onClick={async () => {
          const res = await fetch('/api/auth/signout', { method: 'POST' });
          const data = await res.json();

          console.log(data);
          if (res.ok) {
            router.push('/auth/signup');
          }
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    const user = req.session.user;

    if (!user || user === undefined) {
      return {
        redirect: {
          destination: '/auth/signup',
          permanent: false,
        },
      };
    }

    if (user) {
      return {
        props: { user },
      };
    }
  }
);
