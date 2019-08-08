import * as React from 'react';
type SceneTracker = { canHandleBack: () => boolean };

export default React.createContext() as React.Context<SceneTracker>;
