'use client'
import { useEffect, useState } from 'react';
import { useNavigationEvent } from 'navigation-react';

const Toggle = ({label, children}: any) => {
  const {data: {name}} = useNavigationEvent();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
  }, [name]);
  return (
    <>
      <button onClick={() => setShow(!show)}>{`${show ? 'Hide' : 'Show'} ${label}`}</button>
      {show && children}
    </>
  );
}

export default Toggle;
