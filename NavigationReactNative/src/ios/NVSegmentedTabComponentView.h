#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface NVSegmentedTabComponentView : RCTViewComponentView

@property UISegmentedControl *segmentedControl;
@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) NSNumber *fontSize;
@property (nonatomic, copy) UIColor *unselectedTintColor;

@end

NS_ASSUME_NONNULL_END
#endif
