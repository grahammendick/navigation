# Navigation Native Redux
In Navigation, each scene has its own separate React tree. Because there's no shared root you need a global store library, like Redux, to share data between scenes. The `Blinkers` component ensures that Redux only propagates store changes to visible scenes.

## Run
Once you've cloned the repository, you can install the dependencies and start the Redux example:

    npm install
    react-native run-android
    react-native run-ios

