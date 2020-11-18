#import <UIKit/UIKit.h>

@interface NVStatusBarView : UIView

@property (nonatomic, assign) UIStatusBarStyle tintStyle;
@property (nonatomic, assign) BOOL hidden;

#define STATUS_BAR ((int) 78)

@end
