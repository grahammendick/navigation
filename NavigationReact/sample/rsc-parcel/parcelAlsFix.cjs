// https://github.com/parcel-bundler/parcel/issues/10397
globalThis.AsyncLocalStorage = require('node:async_hooks').AsyncLocalStorage;
