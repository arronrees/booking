import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import NextNProgress from 'nextjs-progressbar';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='bg-mid-blue text-white min-h-screen'>
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            fontWeight: 500,
            padding: '1rem',
            marginTop: '1rem',
            lineHeight: 1.35,
            boxShadow:
              '0 5px 8px -1px rgb(0 0 0 / 0.15), 0 2px 4px -2px rgb(0 0 0 / 0.15)',
          },
        }}
      />
      <NextNProgress />
      <Component {...pageProps} />
    </div>
  );
}
