import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='bg-slate-800 text-white'>
      <Component {...pageProps} />
    </div>
  );
}
