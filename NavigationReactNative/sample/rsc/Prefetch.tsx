'use client';
import { useEffect } from 'react';
import { usePrefetch } from 'navigation-react';

const Prefetch = () => {
  const prefetch = usePrefetch();
  useEffect(() => {
    prefetch.navigate('person', {id: 2});
  }, [prefetch]);
  return null;
};

export default Prefetch;
