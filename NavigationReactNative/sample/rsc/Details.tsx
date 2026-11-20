import { Text } from 'react-native';
import { useNavigationEvent } from 'navigation-react';

const Details = () => {
  const {data: {id}} = useNavigationEvent();
  return <Text style={{fontSize: 20, padding: 10}}>Details {id}</Text>;
};

export default Details;
