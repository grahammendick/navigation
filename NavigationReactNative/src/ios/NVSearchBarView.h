#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import "NVSceneController.h"

@interface NVSearchBarView : UIView <UISearchResultsUpdating, UISearchBarDelegate, NVSearchBar>

@property UISearchController *searchController;
@property (nonatomic, assign) BOOL hideWhenScrolling;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, assign) NSInteger mostRecentActiveEventCount;
@property (nonatomic, assign) NSInteger mostRecentButtonEventCount;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;
@property (nonatomic, copy) RCTDirectEventBlock onChangeActive;
@property (nonatomic, copy) RCTDirectEventBlock onQuery;
@property (nonatomic, copy) RCTDirectEventBlock onChangeScopeButton;

-(id)initWithBridge: (RCTBridge *)bridge;

@end
