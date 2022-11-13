import 'react-native';
import React from 'react';
import App from '../App';
import { render, screen, fireEvent, within } from '@testing-library/react-native';

describe('Twitter', () => {
  it('should display Home and Notifications tabs with Home selected', () => {
    const { getAllByRole, getByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const homeTab = within(tabsScene).getByRole('tab', {name: 'Home', selected: true});
    const notificationsTab = within(tabsScene).getByRole('tab', {name: 'Notifications', selected: false});
    expect(homeTab).toBeTruthy();    
  });
});

describe('Home', () => {
  it('should have title Home', () => {
    const { getAllByRole, getByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const homeTab = within(tabsScene).getByRole('tabpanel', {name: 'Home'});
    const header = within(homeTab).getByRole('header', {name: 'Home'});
    expect(header).toBeTruthy();    
  });

  it('should navigate to Tweet', () => {
    const { getAllByRole, getByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const homeTab = within(tabsScene).getByRole('tabpanel', {name: 'Home'});
    const tweetButton = within(homeTab).getAllByRole('button', {name: 'Dan Abramov'})[0];
    fireEvent.press(tweetButton);
    const tweetScene = within(homeTab).getByRole('window', {selected: true});
    const header = within(tweetScene).getByRole('header', {name: 'Tweet'});
    expect(header).toBeTruthy(); 
  });

  it('should navigate to Timeline', () => {
    const { getAllByRole, getByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const homeTab = within(tabsScene).getByRole('tabpanel', {name: 'Home'});
    const tweetButton = within(homeTab).getAllByRole('button', {name: 'Dan Abramov'})[0];
    const timelineButton = within(tweetButton).getAllByRole('button')[1];
    fireEvent.press(timelineButton);
    const timelineScene = within(homeTab).getByRole('window', {selected: true});
    const header = within(timelineScene).getByRole('header', {name: 'Dan Abramov'});
    expect(header).toBeTruthy(); 
  });
});
