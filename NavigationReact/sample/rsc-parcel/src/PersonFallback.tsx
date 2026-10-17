'use client';
import { NavigationLink } from 'navigation-react';

const PersonFallback = () => (
  <div>
    <div>Person not found</div>
    <NavigationLink stateKey="person" navigationData={{id: 1}}>Person 1</NavigationLink>
  </div>
);

export default PersonFallback;
