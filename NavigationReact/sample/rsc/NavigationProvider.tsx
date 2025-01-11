'use client'
import { useMemo } from "react";
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import { NavigationHandler } from "navigation-react";
import stateNavigator from "./stateNavigator";

const NavigationProvider = ({url, children}: any) => {
    const navigator = useMemo(() => {
        const navigator = new StateNavigator(stateNavigator, new HTML5HistoryManager());
        navigator.navigateLink(url);
        return navigator;
    }, []);
    return (
        <NavigationHandler stateNavigator={navigator}>
            {children}
        </NavigationHandler>
    )
}

export default NavigationProvider;
