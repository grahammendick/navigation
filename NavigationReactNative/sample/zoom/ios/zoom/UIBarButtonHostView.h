#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface UIBarButtonHostView : UIView

@property (nonatomic, assign) NSString *title;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end

