#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>

@interface NVStackController : UINavigationController <UINavigationBarDelegate>

@property (nonatomic, strong)  UIViewController *retainedViewController;

@end

@interface NVNavigationStackView : UIView <UINavigationControllerDelegate, UIGestureRecognizerDelegate>

@property (nonatomic, strong) NVStackController *navigationController;
@property (nonatomic, copy) NSArray *keys;
@property (nonatomic, copy) NSString *enterAnim;
@property (nonatomic, assign) BOOL enterAnimOff;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTDirectEventBlock onWillNavigateBack;
@property (nonatomic, copy) RCTDirectEventBlock onRest;

-(id)initWithBridge: (RCTBridge *)bridge;

@end

