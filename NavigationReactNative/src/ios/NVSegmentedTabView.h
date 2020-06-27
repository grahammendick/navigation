#import "NVTabBarPagerView.h"
#import "NVTabBarPagerView.h"

#import <UIKit/UIKit.h>

@interface NVSegmentedTabView : UISegmentedControl <TabChangeDelegate>

-(void)setupWithPager:(NVTabBarPagerView *) pager;

@end
