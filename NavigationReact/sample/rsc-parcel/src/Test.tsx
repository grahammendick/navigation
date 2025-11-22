'use client'
import { useRefetch } from 'navigation-react';

const Test = () => {
    const refetch = useRefetch();
  return (
    <button onClick={async () => {
        await fetch('/test', { method: 'POST'});
        refetch(true);
    }}>
        Test
    </button>
  );
}

export default Test;
