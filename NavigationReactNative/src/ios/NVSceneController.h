#import <UIKit/UIKit.h>

@interface NVSceneController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(NVSceneController *controller);
@property (nonatomic, assign) UIStatusBarStyle statusBarStyle;
@property (nonatomic, assign) BOOL statusBarHidden;

- (id)initWithScene:(UIView *)view;

@end

@protocol NVScene

@property (nonatomic, assign) BOOL hidesTabBar;
- (void)didPop;

@end

@protocol NVNavigationBar

@property (nonatomic, assign) BOOL isHidden;
@property (nonatomic, assign) BOOL largeTitle;
@property (nonatomic, copy) NSString* title;
@property (nonatomic, copy) NSString *backTitle;
- (void)updateStyle;

@end

@protocol NVSearchBar

@property UISearchController *searchController;
@property (nonatomic, assign) BOOL hideWhenScrolling;

@end

@protocol NVStatusBar

@property (nonatomic, assign) UIStatusBarStyle tintStyle;
@property (nonatomic, assign) BOOL hidden;
- (void)updateStyle;

@end
