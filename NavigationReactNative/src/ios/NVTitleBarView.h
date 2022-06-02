#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>

@interface NVTitleBarView : UIView

@property (nonatomic, copy) RCTDirectEventBlock onChangeBounds;

-(id)initWithBridge: (RCTBridge *)bridge;

@end
