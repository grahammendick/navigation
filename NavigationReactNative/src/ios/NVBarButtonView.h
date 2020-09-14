#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVBarButtonView : UIView

@property UIBarButtonItem *button;
@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end
