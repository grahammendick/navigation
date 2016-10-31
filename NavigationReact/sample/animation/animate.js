import React from 'react';
import {TransitionMotion, spring} from 'react-motion';

export default (Component) => ({ direction, ...data }) => (
    <TransitionMotion
        willLeave={() => ({left: spring(direction * -200)})}
        willEnter={() => ({left: direction * 200})}
        styles={[{
            key: data.stateNavigator.stateContext.state.key,
            data: data,
            style: {left: spring(0)}
        }]}>
        {interpolatedStyles =>
            <div>
                {interpolatedStyles.map(config => (
                    <div id="container" key={config.key} style={{left: config.style.left}}>
                        <div id="view">
                            <Component {...data} />
                        </div>
                    </div>
                ))}
            </div>
        }
    </TransitionMotion>
)
