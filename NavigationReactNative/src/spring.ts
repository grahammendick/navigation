import { OpaqueConfig, spring, SpringHelperConfig } from 'react-motion';

export default (val: number, config?: SpringHelperConfig): OpaqueConfig => spring(val, config);

