"use server-entry";

import "./client";
import React from "react";
import { Resources } from "@parcel/runtime-rsc";
import { SceneView } from "navigation-react";
import RootProvider from "./RootProvider";
import PersonLayout from "./PersonLayout";
const People = React.lazy(() => import("./People"));
const Person = React.lazy(() => import("./Person"));
const Friends = React.lazy(() => import("./Friends"));

const App = async ({url}: any) => {
  return (
    <html>
      <head>
        <title>RSC Example</title>
        <Resources />
      </head>
      <body>
        <RootProvider url={url}>
          <SceneView active="people">
            <People />
          </SceneView>
          <PersonLayout
            person={(
              <SceneView active="person" dataDeps={['id']}>
                <Person />
              </SceneView>
            )}
            friends={(
              <SceneView active="person" name="friends" dataDeps={['id', 'show']}>
                <Friends />
            </SceneView>
            )} />
        </RootProvider>
      </body>
    </html>
  );
}

export default App;
