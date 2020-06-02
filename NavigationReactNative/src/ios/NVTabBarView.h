#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVTabBarView : UIView <UITabBarControllerDelegate>

@property (nonatomic, assign) NSInteger tabCount;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTDirectEventBlock onTabSelected;

-(void)hideTabBar;
-(void)showTabBar;

@end
