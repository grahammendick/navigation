#import <UIKit/UIKit.h>
#import "NVSceneController.h"

@interface NVBottomSheetController : UIViewController <NVSharedElementController>

@property (nonatomic, assign) BOOL root;
@property NSMutableSet<UIView<NVSharedElement>*> *sharedElements;
@property (nonatomic, copy) void (^boundsDidChangeBlock)(CGRect newBounds);
@property (nonatomic, copy) void (^didDismiss)(void);

@end
