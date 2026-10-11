import { useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';

const Name = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name} = await getPerson(id);
  return (
    <>
      <title>{name}</title>
      <h1>{name}</h1>
    </>
  );
}

export default Name;
