#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>
#import "NVSceneController.h"

NS_ASSUME_NONNULL_BEGIN

@interface NVStatusBarComponentView : RCTViewComponentView <NVStatusBar>

@property (nonatomic, assign) UIStatusBarStyle tintStyle;
@property (nonatomic, assign) BOOL hidden;

-(void)updateStyle;

@end

NS_ASSUME_NONNULL_END
#endif
