import { OpaqueConfig, spring, SpringHelperConfig } from 'react-motion';

export default (val, config) => (
    spring(val, {precision: 0.1, ...config})
);

