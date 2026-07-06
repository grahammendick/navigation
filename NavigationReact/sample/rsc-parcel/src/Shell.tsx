'use client';
import { Suspense } from "react";

const Shell = ({children}: any) => <Suspense fallback={<h2>Loading...</h2>}> {children}</Suspense>;

export default Shell;
