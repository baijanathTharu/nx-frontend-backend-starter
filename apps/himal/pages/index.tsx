import styles from './index.module.scss';
import { useHelloQuery } from '@kchhaa/shared-types';

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function Index() {
  const { data, isLoading, error } = useHelloQuery({
    endpoint: 'http://localhost:1729/graphql',
    fetchParams: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });

  if (isError(error)) {
    console.log(error.message);
    return <div style={{ color: 'red' }}>{error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{data?.hello}</div>;
}

export default Index;
