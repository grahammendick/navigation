import { useNavigationEvent } from 'navigation-react';

const Banner = async () => {
  const {data: {id}} = useNavigationEvent();
  await new Promise(res => {
    setTimeout(res, 5000);
  })
  return (
    <h1>{id}</h1>
  )
}

export default Banner;
