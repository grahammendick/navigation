#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVSearchBarView : UIView

@property (nonatomic, assign) BOOL hideWhenScrolling;
@property (nonatomic, assign) UITextAutocapitalizationType autoCapitalize;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;

@end
