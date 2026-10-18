'use client';
import { RefreshLink } from 'navigation-react';

const ListFallback = () => (
  <div>
    <div>Error</div>
    <RefreshLink navigationData={{allowed: true}} includeCurrentData>Allow</RefreshLink>
  </div>
);

export default ListFallback;
