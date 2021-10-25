#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>

@interface NVSearchBarView : UIView <UISearchResultsUpdating, UISearchBarDelegate>

@property UISearchController *searchController;
@property (nonatomic, assign) BOOL hideWhenScrolling;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, assign) NSInteger mostRecentButtonEventCount;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;
@property (nonatomic, copy) RCTDirectEventBlock onChangeScopeButton;

#define SEARCH_BAR ((int) 58)

-(id)initWithBridge: (RCTBridge *)bridge;

@end

@interface NVSearchController : UISearchController

@end
