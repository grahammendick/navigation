#import <UIKit/UIKit.h>

@interface NVTabBarView : UIView <UITabBarControllerDelegate>

@property (nonatomic, copy) UIColor *barTintColor;
@property (nonatomic, copy) UIColor *tintColor;
@property (nonatomic, copy) UIColor *unselectedTintColor;
@property (nonatomic, assign) BOOL isTranslucent;

@end
