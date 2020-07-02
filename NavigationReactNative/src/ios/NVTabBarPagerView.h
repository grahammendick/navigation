#import "NVTabBarPagerView.h"

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVTabBarPagerView : UIView

@property (nonatomic, assign) NSInteger selectedTab;
@property (nonatomic, assign) NSInteger tabCount;
@property (nonatomic, assign) BOOL scrollsToTop;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTDirectEventBlock onTabSelected;

-(void)setCurrentTab:(NSInteger) index;
-(void)scrollToTop;

@end
