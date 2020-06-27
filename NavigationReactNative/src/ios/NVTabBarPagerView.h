#import "NVTabBarPagerView.h"

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVTabBarPagerView : UIView
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTDirectEventBlock onTabSelected;

-(void)setCurrentTab:(NSInteger) index;

@end
