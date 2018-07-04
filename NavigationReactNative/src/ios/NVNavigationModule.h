#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface NVNavigationModule : RCTEventEmitter <RCTBridgeModule, UINavigationControllerDelegate>
@end
