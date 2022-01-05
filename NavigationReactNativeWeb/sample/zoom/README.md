# Navigation React Native Web
The Navigation router lets you run your code on Android, iOS and the Web. It uses the underlying native API to provide faithful navigation on Android and iOS. It uses React Native for Web and Navigation React Native Web to run this same code on the Web.

## Run
Once you've cloned the repository, you can install the dependencies for React Native and Web and build the Web bundle:

    npm install
    npm run build
    cd ios && pod install && cd ..
    npx react-native start
    
Run the command `npx react-native run-android` to start the Android app.  
Run the command `npx react-native run-ios` to start the iOS app.  
Open app.html to start the Web app.