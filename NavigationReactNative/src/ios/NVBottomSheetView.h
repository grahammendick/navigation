#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>

@interface NVBottomSheetView : UIView <CAAnimationDelegate>

-(id)initWithBridge: (RCTBridge *)bridge;

@end
