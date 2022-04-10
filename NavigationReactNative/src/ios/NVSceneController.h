#import <UIKit/UIKit.h>
#import "NVStatusBarView.h"

@interface NVSceneController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(NVSceneController *controller);
@property (nonatomic, assign) UIStatusBarStyle statusBarStyle;
@property (nonatomic, assign) BOOL statusBarHidden;

- (id)initWithScene:(UIView *)view;

@end

@protocol NVScene

- (void)didPop;

@end
