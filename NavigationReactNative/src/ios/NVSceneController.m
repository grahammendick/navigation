#import "NVSceneController.h"
#import "NVSceneView.h"
#import "NVNavigationBarView.h"
#import "NVSearchBarView.h"
#import "NVStatusBarView.h"

@implementation NVSceneController
{
    NVSceneView *_view;
    CGRect _lastViewFrame;
    UIStatusBarStyle _statusBarStyle;
    BOOL _statusBarHidden;
}

- (id)initWithScene:(NVSceneView *)view
{
    if (self = [super init]) {
        _view = view;
    }
    return self;
}

- (void)loadView
{
    [super loadView];
    self.view = _view;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    NVSearchBarView *searchBar = (NVSearchBarView *) [self.view viewWithTag:SEARCH_BAR];
    NVNavigationBarView *navigationBar = (NVNavigationBarView *) [self.view viewWithTag:NAVIGATION_BAR];
    self.definesPresentationContext = true;
    if (!!searchBar && !navigationBar.hidden)
    {
        if (@available(iOS 11.0, *)) {
            [self.navigationItem setSearchController:searchBar.searchController];
            [self.navigationItem setHidesSearchBarWhenScrolling:searchBar.hideWhenScrolling];
        }
    }
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    NSInteger crumb = [self.navigationController.viewControllers indexOfObject:self];
    UIViewController *previousController = crumb > 0 ? [self.navigationController.viewControllers objectAtIndex:crumb - 1] : nil;
    NVNavigationBarView *navigationBar = (NVNavigationBarView *) [self.view viewWithTag:NAVIGATION_BAR];
    BOOL hidden = navigationBar.hidden;
    if (@available(iOS 13.0, *)) {
    } else {
        if (@available(iOS 11.0, *)) {
            hidden = hidden || previousController.navigationItem.searchController.active;
        }
    }
    [self.navigationController setNavigationBarHidden:hidden];
    if (navigationBar.title.length != 0) {
        [self.navigationItem setTitle:navigationBar.title];
    }
    previousController.navigationItem.backBarButtonItem = nil;
    if (navigationBar.backTitle != nil) {
        previousController.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:navigationBar.backTitle style:UIBarButtonItemStylePlain target:nil action:nil];
    }
    [navigationBar updateStyle];
    if (@available(iOS 11.0, *)) {
        self.navigationController.navigationBar.prefersLargeTitles = true;
        [self.navigationItem setLargeTitleDisplayMode:navigationBar.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever];
    }
    [self statusBarDidUpdate:[navigationBar viewWithTag:STATUS_BAR]];
}

- (void)viewWillLayoutSubviews
{
    [super viewWillLayoutSubviews];
    NSInteger crumb = [self.navigationController.viewControllers indexOfObject:self];
    UIViewController *previousController = crumb > 0 ? [self.navigationController.viewControllers objectAtIndex:crumb - 1] : nil;
    NVNavigationBarView *navigationBar = (NVNavigationBarView *) [self.view viewWithTag:NAVIGATION_BAR];
    if (@available(iOS 11.0, *)) {
        if (previousController.navigationItem.searchController.active) {
            [self.navigationController setNavigationBarHidden:navigationBar.hidden];
        }
    }
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    NVNavigationBarView *navigationBar = (NVNavigationBarView *) [self.view viewWithTag:NAVIGATION_BAR];
    [navigationBar updateStyle];
}

- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    if (self.boundsDidChangeBlock && !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
        self.boundsDidChangeBlock(self);
        _lastViewFrame = self.view.frame;
    }
}

- (BOOL)viewControllerBasedStatusBarAppearance
{
  static BOOL value;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    value = [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIViewControllerBasedStatusBarAppearance"] ?: @YES boolValue];
  });

  return value;
}

- (void)statusBarDidUpdate:(NVStatusBarView *)statusBar
{
    _statusBarStyle = statusBar.tintStyle ?: UIStatusBarStyleDefault;
    _statusBarHidden = !!statusBar.hidden;
    if ([self viewControllerBasedStatusBarAppearance]) {
        [UIApplication.sharedApplication.keyWindow.rootViewController setNeedsStatusBarAppearanceUpdate];
    } else {
        if (self.navigationController.topViewController == self
            && (!self.navigationController.presentedViewController || self.navigationController.presentedViewController.modalPresentationStyle != UIModalPresentationFullScreen)) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
            [UIApplication.sharedApplication setStatusBarStyle:_statusBarStyle];
            [UIApplication.sharedApplication setStatusBarHidden:_statusBarHidden];
#pragma clang diagnostic pop
        }
    }
}

- (UIViewController *)childViewControllerForStatusBarStyle
{
    return nil;
}

- (UIViewController *)childViewControllerForStatusBarHidden
{
    return nil;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return _statusBarStyle;
}

- (BOOL)prefersStatusBarHidden
{
    return _statusBarHidden;
}

- (BOOL)hidesBottomBarWhenPushed
{
    return [self.navigationController.visibleViewController isEqual:self] && _view.hidesTabBar;
}

- (void)dealloc
{
    [_view didPop];
}

@end
