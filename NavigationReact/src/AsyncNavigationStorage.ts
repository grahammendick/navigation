import { AsyncLocalStorage } from 'async_hooks';

export default new AsyncLocalStorage<{data: Set<string>, state: boolean}>();
