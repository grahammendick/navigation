import { useContext, useEffect } from 'react';
import BackHandlerContext from './BackHandlerContext';

const BackButton = ({onPress}: {onPress: () => boolean}) => {
  const backHandler = useContext(BackHandlerContext);
  useEffect(() => {
    const subscription = backHandler.addEventListener('hardwareBackPress', onPress);
    return () => subscription.remove();
  }, [onPress])
  return null;
}

export default BackButton;
