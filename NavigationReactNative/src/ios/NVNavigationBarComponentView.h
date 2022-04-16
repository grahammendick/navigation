#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>
#import "NVSceneController.h"

NS_ASSUME_NONNULL_BEGIN

@interface NVNavigationBarComponentView : RCTViewComponentView <NVNavigationBar>

@property (nonatomic, copy) NSString *title;

@end

NS_ASSUME_NONNULL_END
#endif
