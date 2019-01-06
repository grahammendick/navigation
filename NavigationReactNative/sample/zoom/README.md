# Navigation Native Zoom
Navigation uses the underlying native API to provide shared element transitions on Android.
Because Navigation uses the underlying native APIs you can handle deep links outside of components.

## Run
Once you've cloned the repository, you can install the dependencies and start the Zoom example:

    npm install
    react-native run-android
    react-native run-ios

Then run the commands `adb shell am start  -W -a android.intent.action.VIEW -d "zoom://app?color=blue" com.zoom` (android) and `xcrun simctl openurl booted zoom://app?color=blue` (iOS) to simulate clicking a deep link. The app navigates to the 'detail' scene and displays the color blue.

