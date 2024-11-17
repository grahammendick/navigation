/*
 * This file is necessary to declare global functions that might also be included by `--lib dom`.
 * Due to a TypeScript bug, these cannot be placed inside a `declare global` block in index.d.ts.
 * https://github.com/Microsoft/TypeScript/issues/16430
 */

//
// Timer Functions
//
declare function clearInterval(handle: number): void;
declare function clearTimeout(handle: number): void;
declare function setInterval(handler: () => void, timeout: number): number;
declare function setInterval<Args extends any[]>(handler: (...args: Args) => void, timeout?: number, ...args: Args): number;
declare function setTimeout(handler: () => void, timeout: number): number;
declare function setTimeout<Args extends any[]>(handler: (...args: Args) => void, timeout?: number, ...args: Args): number;
declare function clearImmediate(handle: number): void;
declare function setImmediate(handler: () => void): number;
declare function setImmediate<Args extends any[]>(handler: (...args: Args) => void, ...args: Args): number;

declare function cancelAnimationFrame(handle: number): void;
declare function requestAnimationFrame(callback: (time: number) => void): number;

declare function fetchBundle(bundleId: number, callback: (error?: Error | null) => void): void;
