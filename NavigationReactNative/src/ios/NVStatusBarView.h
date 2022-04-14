#import <UIKit/UIKit.h>

@interface NVStatusBarView : UIView

@property (nonatomic, assign) UIStatusBarStyle tintStyle;
@property (nonatomic, assign) BOOL hidden;

-(void)updateStyle;

#define STATUS_BAR ((int) 78787878)

@end
