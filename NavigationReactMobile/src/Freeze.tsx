import React, { Suspense, useContext } from 'react';
import RSCContext from './RSCContext';

const infiniteThenable = {then: () => {}};

var Suspender = ({freeze, children}) => {
    if (freeze) throw infiniteThenable;
    return children;
};

var Freeze = ({enabled, children}) => {
    const fetchRSC = useContext(RSCContext);
    const suspendable = !!React.Suspense && !fetchRSC;
    const suspender = <Suspender freeze={enabled && suspendable}>{children}</Suspender>;
    return suspendable ? <Suspense fallback={null}>{suspender}</Suspense> : suspender;
};

export default Freeze;

