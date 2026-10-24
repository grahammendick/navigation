'use client'
import { useState } from 'react';

const Toggle = ({label, children}: any) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>{`${show ? 'Hide' : 'Show'} ${label}`}</button>
      {show && children}
    </>
  );
}

export default Toggle;
