'use client'

import React, { Suspense } from 'react';

const ShellInner = ({children}) => children;

const Shell = ({children}) => (
    <Suspense fallback={<h2>Loading...</h2>}>
        <ShellInner>{children}</ShellInner>
    </Suspense>
);
export default Shell;
