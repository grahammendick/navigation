#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface UIBarButtonHostView : UIView

@property UIBarButtonItem *button;
@property (nonatomic, assign) NSString *title;
@property (nonatomic, assign) UIImage *image;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end

