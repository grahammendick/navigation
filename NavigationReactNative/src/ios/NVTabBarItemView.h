#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVTabBarItemView : UIView

@property UITabBarItem *tab;
@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) NSNumber *fontSize;
@property (nonatomic, strong) UINavigationController *navigationController;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end
