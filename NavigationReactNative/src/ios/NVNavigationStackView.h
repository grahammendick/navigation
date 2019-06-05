#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>

@interface NVNavigationStackView : UIView <UINavigationControllerDelegate>

@property (nonatomic, strong) UINavigationController *navigationController;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTBubblingEventBlock onDidNavigateBack;

-(id)initWithBridge: (RCTBridge *)bridge;

@end
