import React, { Suspense, Activity } from 'react';

const infiniteThenable = {then: () => {}};

var Suspender = ({freeze, children}) => {
    if (freeze) throw infiniteThenable;
    return children;
};

var Freeze = ({enabled, children}) => {
    if (!!React.Activity)
        return <Activity mode={!enabled ? 'visible' : 'hidden'}>{children}</Activity>;
    const suspendable = !!React.Suspense;
    const suspender = <Suspender freeze={enabled && suspendable}>{children}</Suspender>;
    return suspendable ? <Suspense fallback={null}>{suspender}</Suspense> : suspender;
};

export default Freeze;

