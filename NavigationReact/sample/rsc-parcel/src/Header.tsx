import { useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';

const Header = async () => {
  const {data: {id, show}} = useNavigationEvent();
  const title = id ? (await getPerson(id)).name : 'People';
  return (
    <>
      <title>{title}</title>
      <h1>{title}{show && ' (friends)'}</h1>
    </>
  );
}

export default Header;
