#import <UIKit/UIKit.h>

@interface NVTabBarView : UIView <UITabBarControllerDelegate>

@property (nonatomic, copy) UIColor *barTintColor;
@property (nonatomic, copy) UIColor *selectedTintColor;
@property (nonatomic, copy) UIColor *unselectedTintColor;

@end
