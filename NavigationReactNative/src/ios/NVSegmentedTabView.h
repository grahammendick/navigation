#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVSegmentedTabView : UISegmentedControl

@property (nonatomic, assign) BOOL bottomTabs;
@property (nonatomic, copy) RCTDirectEventBlock onTabSelected;

@end
