#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVSegmentedTabView : UISegmentedControl

@property (nonatomic, assign) BOOL bottomTabs;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTDirectEventBlock onTabSelected;

@end
