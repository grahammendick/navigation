#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface NVTabBarComponentView : RCTViewComponentView <UITabBarControllerDelegate>

@property (nonatomic, assign) BOOL scrollsToTop;
@property (nonatomic, assign) NSInteger mostRecentEventCount;

@end

NS_ASSUME_NONNULL_END
#endif
