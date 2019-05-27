#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>

@interface NVSearchBarView : UIView <UISearchResultsUpdating>

@property (nonatomic, assign) BOOL hideWhenScrolling;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;

-(id)initWithBridge: (RCTBridge *)bridge;

@end
