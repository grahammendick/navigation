import { Suspense } from 'react';
import { Text, View } from 'react-native';

const Slow = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return <Text>slow part</Text>;
};

const Home = () => (
  <View>
    <Text>fast part</Text>
    <Suspense fallback={<Text>loading slow...</Text>}>
      <Slow />
    </Suspense>
  </View>
);

export default Home;
