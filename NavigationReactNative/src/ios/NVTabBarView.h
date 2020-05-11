#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVTabBarView : UIView <UITabBarControllerDelegate>

@property (nonatomic, copy) RCTDirectEventBlock onTabSelected;

@end
