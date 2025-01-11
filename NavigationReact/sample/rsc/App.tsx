"use server-entry";

import "./client";
import React from "react";
import { Resources } from "@parcel/runtime-rsc";
import { SceneView } from "navigation-react";
import NavigationProvider from "./NavigationProvider";
const People = React.lazy(() => import("./People"));
const Person = React.lazy(() => import("./Person"));


const App = async ({url}: any) => {
  return (
    <html>
      <head>
        <title>RSC Example</title>
        <Resources />
      </head>
      <body>
        <NavigationProvider url={url}>
          <SceneView active="people">
            <People />
          </SceneView>
          <SceneView active="person">
            <Person />
          </SceneView>
        </NavigationProvider>
      </body>
    </html>
  );
}

export default App;
