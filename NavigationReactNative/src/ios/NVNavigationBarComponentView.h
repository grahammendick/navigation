#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>
#import "NVSceneController.h"

NS_ASSUME_NONNULL_BEGIN

@interface NVNavigationBarComponentView : RCTViewComponentView <NVNavigationBar>

@property (nonatomic, copy) NSNumber *crumb;
@property (nonatomic, assign) BOOL isHidden;
@property (nonatomic, assign) BOOL largeTitle;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *titleFontFamily;
@property (nonatomic, copy) NSString *titleFontWeight;
@property (nonatomic, copy) NSString *titleFontStyle;
@property (nonatomic, copy) NSNumber *titleFontSize;
@property (nonatomic, copy) NSString *largeTitleFontFamily;
@property (nonatomic, copy) NSString *largeTitleFontWeight;
@property (nonatomic, copy) NSString *largeTitleFontStyle;
@property (nonatomic, copy) NSNumber *largeTitleFontSize;
@property (nonatomic, copy) NSString *backFontFamily;
@property (nonatomic, copy) NSString *backFontWeight;
@property (nonatomic, copy) NSString *backFontStyle;
@property (nonatomic, copy) NSNumber *backFontSize;
@property (nonatomic, copy) UIColor *barTintColor;
@property (nonatomic, copy) UIColor *largeBarTintColor;
@property (nonatomic, copy) UIColor *tintColor;
@property (nonatomic, copy) UIColor *titleColor;
@property (nonatomic, copy) UIColor *largeTitleColor;
@property (nonatomic, copy) UIColor *shadowColor;
@property (nonatomic, copy) NSString *backTitle;
@property (nonatomic, copy) NSString *backTestID;
@property (nonatomic, assign) BOOL backImageLoading;
@property (nonatomic, copy) void (^ _Nullable backImageDidLoadBlock)(void);

@end

NS_ASSUME_NONNULL_END
#endif
