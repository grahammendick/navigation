import { useNavigationEvent } from 'navigation-react';
import { searchPeople, getPerson } from './data';

const Header = async () => {
  const {state, data: {id, name}} = useNavigationEvent();
  if (state.key === 'person') {
    const {name} = await getPerson(id);
    return (
      <>
        <title>{name}</title>
        <h1>{name}</h1>
      </>
    );
  }
  const {count} = await searchPeople(name, 1, 1, 'asc');
  return (
    <>
      <title>People</title>
      <h1>People</h1>
      <div>{count} {name ? `matching "${name}"` : 'people'}</div>
    </>
  );
}

export default Header;
