import React, { Suspense, useContext } from 'react';

const infiniteThenable = {then: () => {}};

var Suspender = ({freeze, children}) => {
    if (freeze) throw infiniteThenable;
    return children;
};

var Freeze = ({enabled, children}) => {
    const fetchRSC = true;
    const suspendable = !!React.Suspense && !fetchRSC;
    const suspender = <Suspender freeze={enabled && suspendable}>{children}</Suspender>;
    return suspendable ? <Suspense fallback={null}>{suspender}</Suspense> : suspender;
};

export default Freeze;

