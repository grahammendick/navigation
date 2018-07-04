#import <React/RCTBridge.h>
#import <UIKit/UIKit.h>

@protocol NVApplicationHostDelegate

@end

@interface NVApplicationHostDelegate : NSObject <UIApplicationDelegate>

@property (nonatomic, strong) RCTBridge *bridge;

@end
