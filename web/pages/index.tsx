import { withSessionSsr } from '../utils/iron/withSession';
import Header from '../layout/main/Header';

export default function Home() {
  return (
    <div>
      <Header />
    </div>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    const user = req.session.user;

    return {
      props: {},
    };
  }
);
