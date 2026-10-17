'use client'
import { use, useState } from 'react';

const Address = ({address}: {address: Promise<string>}) => {
  const [show, setShow] = useState(false);
  return show ? <div>{use(address)}</div> : <button onClick={() => setShow(true)}>Show Address</button>;
}

export default Address;
