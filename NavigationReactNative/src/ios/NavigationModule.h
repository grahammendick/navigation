#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface NavigationModule : RCTEventEmitter <RCTBridgeModule, UINavigationControllerDelegate>
@end
