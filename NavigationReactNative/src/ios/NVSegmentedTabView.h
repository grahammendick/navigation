#import "NVTabBarPagerView.h"

#import <UIKit/UIKit.h>

@interface NVSegmentedTabView : UISegmentedControl

@property (nonatomic, assign) BOOL bottomTabs;
@property (nonatomic, assign) BOOL scrollsToTop;
@property (nonatomic, weak) NVTabBarPagerView *tabBarPager;

-(void)scrollToTop;

@end
