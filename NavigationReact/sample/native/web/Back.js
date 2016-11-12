import React, { Component } from 'react';

export default ({stateNavigator}) => {
    if (stateNavigator.canNavigateBack(1))
        return <button onClick={(() => stateNavigator.navigateBack(1))}>Back</button>;
    return null;
}

