import * as React from 'react';
import { useNavigationEvent } from 'navigation-react';
import { getPerson } from './data.js';

const Header = async () => {
  const {data: {id}} = useNavigationEvent();
  const title = id ? (await getPerson(id)).name : 'People';
  return (
    <>
      <title>{title}</title>
      <h1>{title}</h1>
    </>
  );
}

export default Header;
