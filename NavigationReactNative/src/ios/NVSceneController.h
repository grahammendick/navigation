#import <UIKit/UIKit.h>

@interface NVSceneController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(NVSceneController *controller);
@property (nonatomic, assign) UIStatusBarStyle statusBarStyle;
@property (nonatomic, assign) BOOL statusBarHidden;

- (id)initWithScene:(UIView *)view;

@end

@protocol NVScene

@property (nonatomic, assign) BOOL hidesTabBar;
@property (nonatomic, copy) NSNumber *crumb;
- (void)didPop;

@end

@protocol NVNavigationBar

@property (nonatomic, assign) BOOL isHidden;
@property (nonatomic, assign) BOOL largeTitle;
@property (nonatomic, copy) NSString* title;
@property (nonatomic, copy) NSString *backTitle;
@property (nonatomic, copy) void (^backImageDidLoadBlock)(void);
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

@interface NVFindNavigationBarNotification : NSObject

@property UIView *scene;
@property UIView<NVNavigationBar> *navigationBar;

- (id)initWithScene:(UIView *)scene;

@end

