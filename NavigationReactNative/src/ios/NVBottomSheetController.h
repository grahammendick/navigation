#import <UIKit/UIKit.h>

@interface NVBottomSheetController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(CGRect newBounds);
@property (nonatomic, copy) void (^didDismiss)(void);

@end
