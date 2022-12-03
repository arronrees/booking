import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';

type SessionOptions = {
  password: string;
  cookieName: string;
  ttl: number;
};

const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: process.env.COOKIE_NAME as string,
  ttl: 86400,
};

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler: GetServerSideProps) {
  return withIronSessionSsr(handler, sessionOptions);
}
