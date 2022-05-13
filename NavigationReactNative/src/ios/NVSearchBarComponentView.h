#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface NVSearchBarComponentView : RCTViewComponentView <UISearchResultsUpdating, UISearchBarDelegate>

@property NSMutableArray *buttons;

@end

NS_ASSUME_NONNULL_END
#endif
