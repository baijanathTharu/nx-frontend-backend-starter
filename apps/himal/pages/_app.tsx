import './styles.css';
import { AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../lib';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default CustomApp;
