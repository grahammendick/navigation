'use client'
import * as React from 'react';
import { useMemo } from "react";
import ReactServerDomWebpackClient from 'react-server-dom-webpack/client';
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import { NavigationHandler } from "navigation-react";
import stateNavigator from "./stateNavigator.js";

const fetchRSC = async (url, options) => {
  const {encodeReply, createFromFetch} = ReactServerDomWebpackClient;
  const response = fetch(url, {
    ...options,
    headers: {
      Accept: 'text/x-component',
      ...options?.headers,
    },
    body: options && 'body' in options 
      ? await encodeReply(options.body)
      : undefined,
  });
  return createFromFetch(response);
}

const RootProvider = ({url, children}) => {
  const navigator = useMemo(() => {
    const navigator = new StateNavigator(stateNavigator, new HTML5HistoryManager());
    navigator.navigateLink(url);
    return navigator;
  }, []);
  return (
    <NavigationHandler stateNavigator={navigator} fetchRSC={fetchRSC}>
      {children}
    </NavigationHandler>
  )
}

export default RootProvider;
