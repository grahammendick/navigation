#import <UIKit/UIKit.h>

@interface NVSceneController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(NVSceneController *controller);

@end
