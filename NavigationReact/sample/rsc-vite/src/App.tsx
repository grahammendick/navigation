import { SceneView } from 'navigation-react'
import NavigationProvider from './NavigationProvider'
import People from './People'
import Person from './Person'

const App = async ({ url }: any) => {
  return (
    <html>
      <head>
        <title>Navigation React</title>
      </head>
      <body>
        <NavigationProvider url={url}>
          <SceneView active="people" refetch={[]}>
            <People />
          </SceneView>
          <SceneView active="person" refetch={['id']}>
            <Person />
          </SceneView>
        </NavigationProvider>
      </body>
    </html>
  );
}

export default App;
