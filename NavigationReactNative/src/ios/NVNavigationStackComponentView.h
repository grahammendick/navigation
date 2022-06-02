#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface NVNavigationStackComponentView : RCTViewComponentView <UINavigationControllerDelegate>

@property (nonatomic, strong) UINavigationController *navigationController;

@property (nonatomic, copy) NSArray *keys;
@property (nonatomic, assign) BOOL enterAnimOff;
@property (nonatomic, assign) NSInteger mostRecentEventCount;

@end

NS_ASSUME_NONNULL_END
#endif
