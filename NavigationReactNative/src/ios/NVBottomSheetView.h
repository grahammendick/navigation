#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>


@interface NVBottomSheetView : UIView <UISheetPresentationControllerDelegate>

@property (nonatomic, copy) NSString *detent;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTDirectEventBlock onDetentChanged;

-(id)initWithBridge: (RCTBridge *)bridge;

@end
