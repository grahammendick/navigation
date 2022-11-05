/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import { Platform } from 'react-native';
import { TabBarItem } from 'navigation-react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
// Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const { getByTestId } = render(<TabBarItem testID="hello" onPress={() => console.log('yyyy')} />);
  fireEvent.press(getByTestId('hello'), { stopPropagation: () => {} });
});

it('renders App correctly', () => {
  const { getAllByText, getByText, getAllByRole, getByRole } = render(<App />);
  const tab = getByRole('tab', {name: 'Home', selected: true});
  const panel = getAllByRole('tabpanel', {name: 'All'});
  let title = getByRole('header', {name: 'Home'});
  fireEvent.press(getAllByText('Dan Abramov')[0]);
  title = getByRole('header', {name: 'Tweet'});
});
