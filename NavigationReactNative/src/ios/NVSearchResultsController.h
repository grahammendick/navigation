#import <UIKit/UIKit.h>

@interface NVSearchResultsController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(CGRect newBounds);

@end
