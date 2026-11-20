'use client';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import Link from './Link';

const Gender = ({children}: {children: ReactNode}) => {
  const {data: {gender, show}} = useNavigationEvent();
  return (
    <View style={styles.gender}>
      <Link navigationData={{show: !show}}>
        <Text style={[styles.text, styles.selected]}>{`${!show ? 'Show' : 'Hide'} Friends`}</Text>
      </Link>
      {show && (
        <View>
          <View style={styles.options}>
            {[['All', null], ['Male', 'male'], ['Female', 'female'], ['Other', 'other']].map(([label, value]) => (
              <Link key={label} navigationData={{gender: value}}>
                <Text style={[styles.text, (gender || null) === value && styles.selected]}>{label}</Text>
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

const styles = StyleSheet.create({
  gender: {
    padding: 10,
  },
  options: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 10,
  },
  text: {
    fontSize: 20,
  },
  selected: {
    fontWeight: 'bold',
  },
});
