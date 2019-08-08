import * as React from 'react';
type SceneContext = { canHandleBack: () => boolean };

export default React.createContext() as React.Context<SceneContext>;
