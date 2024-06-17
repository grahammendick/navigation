#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface NVTabBarItemComponentView : RCTViewComponentView

@property UITabBarItem *tab;
@property (nonatomic, assign) NSInteger foucCounter;
@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) NSNumber *fontSize;
@property (nonatomic, strong) UINavigationController *navigationController;
@property (nonatomic, copy) void (^ _Nullable stackDidChangeBlock)(NVTabBarItemComponentView *tabBarItemView);

-(void)onPress;

@end

NS_ASSUME_NONNULL_END
#endif
