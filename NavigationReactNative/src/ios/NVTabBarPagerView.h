#import "NVTabBarPagerView.h"
#import "NVTabBarItemView.h"

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVTabBarPagerView : UIView

@property (nonatomic, assign) NSInteger selectedTab;
@property (nonatomic, assign) BOOL contentSync;
@property (nonatomic, assign) NSInteger syncCounter;
@property (nonatomic, assign) NSInteger tabCount;
@property (nonatomic, assign) BOOL scrollsToTop;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTDirectEventBlock onTabSelected;

-(void)selectTab:(NSInteger) index;
-(void)setCurrentTab:(NSInteger) index;
-(NVTabBarItemView *)getTabAt:(NSInteger)index;
-(void)scrollToTop;

@end
