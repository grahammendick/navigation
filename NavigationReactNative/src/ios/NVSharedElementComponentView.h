#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>
#import "NVSceneController.h"

NS_ASSUME_NONNULL_BEGIN

@interface NVSharedElementComponentView : RCTViewComponentView <NVSharedElement>

@property (nonatomic, copy) NSString *name;

@end

NS_ASSUME_NONNULL_END

#endif
