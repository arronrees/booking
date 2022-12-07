import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='bg-dark-blue text-white'>
      <Component {...pageProps} />
    </div>
  );
}
