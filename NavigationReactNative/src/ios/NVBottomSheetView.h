#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import <React/RCTInvalidating.h>

@interface NVBottomSheetView : UIView <UISheetPresentationControllerDelegate, UIAdaptivePresentationControllerDelegate>

@property (nonatomic, copy) NSString *detent;
@property (nonatomic, assign) BOOL modal;
@property (nonatomic, assign) BOOL fullScreen;
@property (nonatomic, assign) BOOL root;
@property (nonatomic, assign) BOOL dismissed;
@property (nonatomic, assign) NSInteger peekHeight;
@property (nonatomic, assign) NSInteger expandedHeight;
@property (nonatomic, assign) NSInteger expandedOffset;
@property (nonatomic, assign) double halfExpandedRatio;
@property (nonatomic, assign) BOOL hideable;
@property (nonatomic, assign) BOOL draggable;
@property (nonatomic, assign) BOOL skipCollapsed;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTDirectEventBlock onDetentChanged;
@property (nonatomic, copy) RCTDirectEventBlock onDismissed;

-(id)initWithBridge: (RCTBridge *)bridge;

@end
