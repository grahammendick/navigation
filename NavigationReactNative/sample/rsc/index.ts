import '@expo/metro-runtime';
import { registerRootComponent } from 'expo';
import App from './App';

(globalThis as any).__webpack_get_script_filename__ = (id: string) => id;

registerRootComponent(App);
