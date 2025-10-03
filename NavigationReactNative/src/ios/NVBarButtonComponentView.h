#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>
#import "NVSceneController.h"

NS_ASSUME_NONNULL_BEGIN

@interface NVBarButtonComponentView : RCTViewComponentView <NVSharedElement>

@property UIBarButtonItem *button;
@property (nonatomic, copy) NSString *name;
@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) NSNumber *fontSize;

@end

NS_ASSUME_NONNULL_END
#endif
