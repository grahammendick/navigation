#import <UIKit/UIKit.h>
#import "NVStatusBarView.h"

@interface NVSceneController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(NVSceneController *controller);
@property (nonatomic, assign) UIStatusBarStyle statusBarStyle;
@property (nonatomic, assign) BOOL statusBarHidden;

- (id)initWithScene:(UIView *)view;

@end

@protocol NVScene

@property (nonatomic, assign) BOOL hidesTabBar;
- (void)didPop;

@end

@protocol NVNavigationBar

@property (nonatomic, assign) BOOL isHidden;
@property (nonatomic, copy) NSString* title;

@end
