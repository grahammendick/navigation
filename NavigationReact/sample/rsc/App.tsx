"use server-entry";

import "./client";
import React from "react";
import { Resources } from "@parcel/runtime-rsc";
import { NavigationHandler, SceneView } from "navigation-react";
import stateNavigator from "./stateNavigator";
const People = React.lazy(() => import("./People"));
const Person = React.lazy(() => import("./Person"));

stateNavigator.start();

const App = () => {
  return (
    <html>
      <head>
        <title>RSC Example</title>
        <Resources />
      </head>
      <body>
        <NavigationHandler stateNavigator={stateNavigator}>
          <SceneView active="people">
            <People />
          </SceneView>
          <SceneView active="person">
            <Person />
          </SceneView>
        </NavigationHandler>
      </body>
    </html>
  );
}

export default App;
