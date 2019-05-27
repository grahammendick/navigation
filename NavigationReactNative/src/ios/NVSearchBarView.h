#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVSearchBarView : UIView <UISearchResultsUpdating>

@property (nonatomic, assign) BOOL hideWhenScrolling;
@property (nonatomic, assign) UITextAutocapitalizationType autoCapitalize;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;

@end
