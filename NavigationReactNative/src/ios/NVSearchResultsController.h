#import <UIKit/UIKit.h>

@interface NVSearchResultsController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(CGRect newBounds);

@end

@interface NVSearchController : UISearchController

@end
