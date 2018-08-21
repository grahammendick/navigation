#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVBarButtonView : UIView

@property UIBarButtonItem *button;
@property (nonatomic, assign) NSString *title;
@property (nonatomic, assign) UIImage *image;
@property (nonatomic, assign) UIBarButtonSystemItem systemItem;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end
