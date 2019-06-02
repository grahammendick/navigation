#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVNavigationStackView : UIView <UINavigationControllerDelegate>

@property (nonatomic, copy) RCTBubblingEventBlock onDidNavigateBack;

@end
