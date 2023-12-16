#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>

@interface NVBarButtonView : UIView

@property UIBarButtonItem *button;
@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) NSNumber *fontSize;
@property (nonatomic, copy) UIColor *tintColor;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

-(id)initWithBridge: (RCTBridge *)bridge;

@end
