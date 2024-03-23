#import <UIKit/UIKit.h>

@protocol NVNavigationBar

@property (nonatomic, assign) BOOL isHidden;
@property (nonatomic, assign) BOOL largeTitle;
@property (nonatomic, copy) NSString* title;
@property (nonatomic, copy) NSString *backTitle;
@property (nonatomic, assign) BOOL backImageLoading;
@property (nonatomic, copy) void (^backImageDidLoadBlock)(void);
- (void)updateStyle;

@end

@interface NVTransition : NSObject

@property (nonatomic, copy) NSString *type;
@property (nonatomic, assign) int duration;
@property (nonatomic, assign) float x;
@property (nonatomic, assign) BOOL xPercent;
@property (nonatomic, assign) float y;
@property (nonatomic, assign) BOOL yPercent;
- (id)initWithType:(NSString *)type;

@end

@interface NVSceneController : UIViewController

@property (nonatomic, copy) void (^boundsDidChangeBlock)(NVSceneController *controller);
@property (nonatomic, assign) UIStatusBarStyle statusBarStyle;
@property (nonatomic, assign) BOOL statusBarHidden;
@property (nonatomic, copy) NSArray<NVTransition*> *enterTrans;
@property (nonatomic, copy) NSArray<NVTransition*> *exitTrans;
@property (nonatomic, copy) NSArray<NVTransition*> *popEnterTrans;
@property (nonatomic, copy) NSArray<NVTransition*> *popExitTrans;

- (id)initWithScene:(UIView *)view;
- (UIView<NVNavigationBar> *) findNavigationBar;

@end

@protocol NVScene

@property (nonatomic, assign) BOOL hidesTabBar;
@property (nonatomic, copy) NSNumber *crumb;
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

@interface NVFindNavigationBarNotification : NSObject

@property UIView *scene;
@property UIView<NVNavigationBar> *navigationBar;

- (id)initWithScene:(UIView *)scene;

@end

