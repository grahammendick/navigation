#import <UIKit/UIKit.h>

@interface NVSceneController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(NVSceneController *controller);

- (id)initWithScene:(UIView *)view;

@end
