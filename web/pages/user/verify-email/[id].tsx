import { GetServerSideProps } from 'next';

interface Props {
  success: boolean;
}

export default function UserVerifyEmail({ success }: Props) {
  return (
    <div>
      {success ? (
        <p>Thanks for confirming your email</p>
      ) : (
        <p>Unable to confirm your email. Please try again.</p>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const { id } = params!;
  const { token } = query;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/email/verify/${id}/${token}`,
    { method: 'POST' }
  );

  if (res.ok) {
    return {
      props: {
        success: true,
      },
    };
  }

  return {
    props: { success: false },
  };
};
