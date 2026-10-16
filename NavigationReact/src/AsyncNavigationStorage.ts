import { AsyncLocalStorage } from 'async_hooks';

export default new AsyncLocalStorage<Set<string>>();
