#import "NVTabBarPagerView.h"

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@protocol TabChangeDelegate
-(void) tabSelected:(NSInteger) index;
@end

@interface NVTabBarPagerView : UIView

@property (nonatomic, assign) NSInteger selectedTab;
@property (nonatomic, assign) BOOL scrollsToTop;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTDirectEventBlock onTabSelected;
@property (nonatomic, weak) id<TabChangeDelegate> tabChange;

-(void)setCurrentTab:(NSInteger) index;
-(void)scrollToTop;

@end
