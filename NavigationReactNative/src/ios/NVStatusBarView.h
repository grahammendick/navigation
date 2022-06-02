#import <UIKit/UIKit.h>
#import "NVSceneController.h"

@interface NVStatusBarView : UIView <NVStatusBar>

@property (nonatomic, assign) UIStatusBarStyle tintStyle;
@property (nonatomic, assign) BOOL hidden;

-(void)updateStyle;

@end
