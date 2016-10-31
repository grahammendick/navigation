import React from 'react';
import {TransitionMotion, spring} from 'react-motion';

export default ({ direction, ...data }) => (
    <TransitionMotion
        willLeave={() => ({left: spring(direction * -400, {precision: 10})})}
        willEnter={() => ({left: direction * 400})}
        styles={[{
            key: data.stateNavigator.stateContext.state.key,
            data: data,
            style: {left: spring(0, {precision: 10})}
        }]}>
        {interpolatedStyles =>
            <div>
                {interpolatedStyles.map(config => {
                    var Component = config.data.component;
                    return <div className="view" key={config.key} style={{left: config.style.left}}>
                        <Component {...config.data} />
                    </div>;
                })}
            </div>
        }
    </TransitionMotion>
);
