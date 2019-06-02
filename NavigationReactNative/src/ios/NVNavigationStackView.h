#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVNavigationStackView : UIView <UINavigationControllerDelegate>

@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTBubblingEventBlock onDidNavigateBack;

@end
