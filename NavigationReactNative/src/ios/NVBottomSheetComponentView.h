#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

API_AVAILABLE(ios(15.0))
@interface NVBottomSheetComponentView : RCTViewComponentView <UISheetPresentationControllerDelegate, UIAdaptivePresentationControllerDelegate>

@end

NS_ASSUME_NONNULL_END

#endif
