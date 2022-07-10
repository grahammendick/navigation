#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface NVTabBarComponentView : RCTViewComponentView <UITabBarControllerDelegate>

@property (nonatomic, assign) BOOL scrollsToTop;
@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) NSNumber *fontSize;
@property (nonatomic, assign) NSInteger mostRecentEventCount;

@end

NS_ASSUME_NONNULL_END
#endif
