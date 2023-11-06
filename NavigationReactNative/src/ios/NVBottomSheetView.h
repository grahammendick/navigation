#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>


@interface NVBottomSheetView : UIView <UISheetPresentationControllerDelegate>

@property (nonatomic, copy) RCTDirectEventBlock onDetentChanged;

-(id)initWithBridge: (RCTBridge *)bridge;

@end
