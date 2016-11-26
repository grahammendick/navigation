import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

export default ({children, stateNavigator, direction}) => (
    <TransitionMotion
        willLeave={() => ({left: spring(direction * -400, {precision: 10})})}
        willEnter={() => ({left: direction * 400})}
        styles={[{
            key: stateNavigator.stateContext.state.key,
            data: children,
            style: {left: spring(0, {precision: 10})}
        }]}>
        {interpolatedStyles =>
            <div>
                {interpolatedStyles.map(config => (
                    <div className="view" key={config.key} style={{left: config.style.left}}>
                        {config.data}
                    </div>
                ))}
            </div>
        }
    </TransitionMotion>
);
