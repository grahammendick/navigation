#import <UIKit/UIKit.h>
#import "NVStatusBarView.h"

@interface NVSceneController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(NVSceneController *controller);

- (id)initWithScene:(UIView *)view;
- (void)statusBarDidUpdate:(NVStatusBarView *)statusBar;

@end
