import 'react-native';
import React from 'react';
import App from '../App';
import { render, fireEvent, within } from '@testing-library/react-native';

describe('Twitter', () => {
  it('should display Home and Notifications tabs with Home selected', () => {
    const { getAllByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const homeTab = within(tabsScene).getByRole('tab', {name: 'Home', selected: true});
    const notificationsTab = within(tabsScene).getByRole('tab', {name: 'Notifications', selected: false});
    expect(homeTab).toBeTruthy();    
  });
});

describe('Home', () => {
  it('should have title Home', () => {
    const { getAllByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const homeTab = within(tabsScene).getByRole('tabpanel', {name: 'Home'});
    const header = within(homeTab).getByRole('header', {name: 'Home'});
    expect(header).toBeTruthy();    
  });

  it('should navigate to Tweet', () => {
    const { getAllByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const homeTab = within(tabsScene).getByRole('tabpanel', {name: 'Home'});
    const tweetButton = within(homeTab).getAllByRole('button', {name: 'Dan Abramov'})[0];
    fireEvent.press(tweetButton);
    const tweetScene = within(homeTab).getByRole('window', {selected: true});
    const header = within(tweetScene).getByRole('header', {name: 'Tweet'});
    expect(header).toBeTruthy(); 
  });

  it('should navigate back to Home', () => {
    const { getAllByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const homeTab = within(tabsScene).getByRole('tabpanel', {name: 'Home'});
    const tweetButton = within(homeTab).getAllByRole('button', {name: 'Dan Abramov'})[0];
    fireEvent.press(tweetButton);
    const tweetScene = within(homeTab).getByRole('window', {selected: true});
    const tweetHeader = within(tweetScene).getByRole('header', {name: 'Tweet'});
    const backButton = within(tweetScene).getByRole('menuitem');
    fireEvent.press(backButton);
    const homeScene = within(homeTab).getByRole('window', {selected: true});
    const homeHeader = within(homeScene).getByRole('header', {name: 'Home'});
    expect(tweetHeader).toBeTruthy(); 
    expect(homeHeader).toBeTruthy(); 
  });

  it('should navigate to Timeline', () => {
    const { getAllByRole } = render(<App />);
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

describe('Notifications', () => {
  it('should have title Notifications', () => {
    const { getAllByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const notificationsTab = within(tabsScene).getByRole('tabpanel', {name: 'Notifications'});
    const header = within(notificationsTab).getByRole('header', {name: 'Notifications'});
    expect(header).toBeTruthy();    
  });

  it('should display All and Mentions tabs with All selected', () => {
    const { getAllByRole } = render(<App />);
    const tabsScene = getAllByRole('window', {selected: true})[0];
    const notificationsScene = within(tabsScene).getAllByRole('window', {selected: true})[0];
    const allTab = within(notificationsScene).getByRole('tab', {name: 'All', selected: true});
    const mentionsTab = within(notificationsScene).getByRole('tab', {name: 'Mentions', selected: false});
    expect(allTab).toBeTruthy();    
    expect(mentionsTab).toBeTruthy();    
  });
});
