'use client';
import { Text, View } from 'react-native';
import Link from './Link';

const Home = () => (
  <View style={{paddingTop: 80}}>
    <Text style={{fontSize: 32}}>Client Home</Text>
    <Link stateKey="people"><Text style={{fontSize: 24}}>People</Text></Link>
  </View>
);

export default Home;
