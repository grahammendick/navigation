'use client';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import Link from './Link';

const Gender = ({children}: {children: ReactNode}) => {
  const {data: {gender, show}} = useNavigationEvent();
  return (
    <View style={{padding: 10}}>
      <Link navigationData={{show: !show}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{`${!show ? 'Show' : 'Hide'} Friends`}</Text>
      </Link>
      {show && (
        <View>
          <View style={{flexDirection: 'row', gap: 20, paddingTop: 10}}>
            {[['All', null], ['Male', 'male'], ['Female', 'female'], ['Other', 'other']].map(([label, value]) => (
              <Link key={label} navigationData={{gender: value}}>
                <Text style={{fontSize: 20, fontWeight: (gender || null) === value ? 'bold' : 'normal'}}>{label}</Text>
              </Link>
            ))}
          </View>
          {children}
        </View>
      )}
    </View>
  );
};

export default Gender;
