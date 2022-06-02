#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import "NVSceneController.h"

@interface NVSearchBarView : UIView <UISearchResultsUpdating, UISearchBarDelegate, NVSearchBar>

@property UISearchController *searchController;
@property (nonatomic, assign) BOOL hideWhenScrolling;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, assign) NSInteger mostRecentButtonEventCount;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;
@property (nonatomic, copy) RCTDirectEventBlock onChangeScopeButton;
@property (nonatomic, copy) RCTDirectEventBlock onChangeBounds;

-(id)initWithBridge: (RCTBridge *)bridge;

@end
