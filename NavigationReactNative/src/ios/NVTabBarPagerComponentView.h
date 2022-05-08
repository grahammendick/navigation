#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface NVTabBarPagerComponentView : RCTViewComponentView

@property (nonatomic, assign) NSInteger selectedTab;
@property (nonatomic, assign) BOOL scrollsToTop;
@property (nonatomic, assign) NSInteger mostRecentEventCount;

-(void)setCurrentTab:(NSInteger) index;
-(void)scrollToTop;

@end

NS_ASSUME_NONNULL_END
#endif
