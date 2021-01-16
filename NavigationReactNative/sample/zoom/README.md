# Navigation Native Zoom
Navigation uses the underlying native API to provide shared element transitions on Android.
Because Navigation uses the underlying native APIs you can handle deep links outside of components.

## Run
Once you've cloned the repository, you can install the dependencies and start the Zoom example:

    npm install
    cd ios && pod install && cd ..
    react-native start
    react-native run-android
    react-native run-ios

Then run the commands `adb shell am start  -W -a android.intent.action.VIEW -d "zoom://app?color=blue" com.zoom` (android) and `xcrun simctl openurl booted zoom://app?color=blue` (iOS) to simulate clicking a deep link. The app navigates to the 'detail' scene and displays the color blue.

## Large Titles on iOS 14
There is a React Native bug that means large titles start collapsed on iOS 14. The fix is to paste the code below into `RCTScrollContentView.m`. This Zoom example uses [patch-package](https://www.npmjs.com/package/patch-package) to automatically apply this change on 'npm install'.
```obj-c
#import "RCTScrollContentView.h"

#import <React/RCTAssert.h>
#import <React/UIView+React.h>

#import "RCTScrollView.h"

@implementation RCTScrollContentView

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    RCTScrollView *scrollView = (RCTScrollView *)self.superview.superview;
    [scrollView updateContentOffsetIfNeeded];
}

- (void)reactSetFrame:(CGRect)frame
{
  [super reactSetFrame:frame];

  RCTScrollView *scrollView = (RCTScrollView *)self.superview.superview;

  if (!scrollView || !self.window) {
    return;
  }

  RCTAssert([scrollView isKindOfClass:[RCTScrollView class]], @"Unexpected view hierarchy of RCTScrollView component.");

  [scrollView updateContentOffsetIfNeeded];
}

@end
```
