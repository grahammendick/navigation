"use server-entry";

import "./client";
import React from "react";
import { Resources } from "@parcel/runtime-rsc";
import { SceneView } from "navigation-react";
const People = React.lazy(() => import("./People"));
const Person = React.lazy(() => import("./Person"));

const App = () => {
  return (
    <html>
      <head>
        <title>RSC Example</title>
        <Resources />
      </head>
      <body>
        <SceneView active="people">
          <People />
        </SceneView>
        <SceneView active="person">
          <Person />
        </SceneView>
      </body>
    </html>
  );
}

export default App;
