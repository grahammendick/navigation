import { useNavigationEvent } from 'navigation-react';

const Header = () => {
  const {state} = useNavigationEvent();
  const title = state.key === 'people' ? 'People' : 'Person';
  return (
    <>
      <title>{title}</title>
      <h1>{title}</h1>
    </>
  );
}

export default Header;
