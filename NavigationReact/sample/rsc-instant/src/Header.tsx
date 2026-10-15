'use client'
import { useNavigationEvent } from 'navigation-react';

const Header = ({children}: any) => {
  const {state} = useNavigationEvent();
  return state.key === 'people' ? (
    <>
      <title>People</title>
      <h1>People</h1>
    </>
  ) : children;
}

export default Header;
