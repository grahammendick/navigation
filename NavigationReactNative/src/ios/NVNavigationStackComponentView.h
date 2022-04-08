#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface NVNavigationStackComponentView : RCTViewComponentView <UINavigationControllerDelegate>

@property (nonatomic, strong) UINavigationController *navigationController;

@end

NS_ASSUME_NONNULL_END
#endif
