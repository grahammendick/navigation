import { useNavigationEvent } from 'navigation-react';
import { searchPeople } from './data';

const Summary = async () => {
  const {data: {name}} = useNavigationEvent();
  const {count} = await searchPeople(name, 1, 1, 'Name');
  return <p>{`${count} people${name ? ` matching '${name}'` : ''}`}</p>;
}

export default Summary;
