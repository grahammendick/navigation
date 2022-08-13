// @flow
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
}
export default (TurboModuleRegistry.get<Spec>(
'Material3'
): ?Spec);
