import React, { Suspense, useContext } from 'react';
import FreezeContext from './FreezeContext.js';

const infiniteThenable = {then: () => {}};

var Suspender = ({freeze, children}) => {
    if (freeze) throw infiniteThenable;
    return children;
};

var Freeze = ({enabled, children}) => {
    const suspendable = !!React.Suspense && useContext(FreezeContext);
    const suspender = <Suspender freeze={enabled && suspendable}>{children}</Suspender>;
    return suspendable ? <Suspense fallback={null}>{suspender}</Suspense> : suspender;
};

export default Freeze;

