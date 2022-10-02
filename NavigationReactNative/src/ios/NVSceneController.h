#import <UIKit/UIKit.h>

@protocol NVNavigationBar

@property (nonatomic, assign) BOOL isHidden;
@property (nonatomic, assign) BOOL largeTitle;
@property (nonatomic, copy) NSString* title;
@property (nonatomic, copy) NSString *backTitle;
@property (nonatomic, assign) BOOL backImageOn;
@property (nonatomic, copy) void (^backImageDidLoadBlock)(void);

- (void)updateStyle;

@end

@interface NVSceneController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(NVSceneController *controller);
@property (nonatomic, assign) UIStatusBarStyle statusBarStyle;
@property (nonatomic, assign) BOOL statusBarHidden;

- (id)initWithScene:(UIView *)view;
- (UIView<NVNavigationBar> *) findNavigationBar:(UIView *)parent;

@end

@protocol NVScene

@property (nonatomic, assign) BOOL hidesTabBar;
- (void)didPop;

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
