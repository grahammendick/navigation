#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTComponent.h>

@interface NVSearchBarView : UIView <UISearchResultsUpdating>

@property UISearchController *searchController;
@property (nonatomic, assign) BOOL hideWhenScrolling;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;

#define SEARCH_BAR ((int) 58)

-(id)initWithBridge: (RCTBridge *)bridge;

@end
