#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>
#import "NVSceneController.h"

NS_ASSUME_NONNULL_BEGIN

@interface NVSearchBarComponentView : RCTViewComponentView <UISearchResultsUpdating, UISearchBarDelegate, NVSearchBar>

@property UISearchController *searchController;
@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) NSNumber *fontSize;
@property (nonatomic, assign) BOOL hideWhenScrolling;
@property (nonatomic, assign) NSInteger mostRecentEventCount;
@property (nonatomic, assign) NSInteger mostRecentActiveEventCount;
@property (nonatomic, assign) NSInteger mostRecentButtonEventCount;

@end

NS_ASSUME_NONNULL_END
#endif
