'use server';
import { useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';
import Title from './Title';

const Name = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name} = await getPerson(id);
  return <Title text={name} />;
};

export default Name;
