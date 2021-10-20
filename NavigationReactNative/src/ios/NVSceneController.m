#import "NVSceneController.h"
#import "NVSceneView.h"
#import "NVNavigationBarView.h"
#import "NVSearchBarView.h"
#import "NVStatusBarView.h"

@implementation NVSceneController
{
    NVSceneView *_view;
    CGRect _lastViewFrame;
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

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    NVNavigationBarView *navigationBar = (NVNavigationBarView *) [self.view viewWithTag:NAVIGATION_BAR];
    NVSearchBarView *searchBar = (NVSearchBarView *) [navigationBar viewWithTag:SEARCH_BAR];
    self.definesPresentationContext = true;
    if (!!searchBar && !navigationBar.hidden)
    {
        if (@available(iOS 11.0, *)) {
            [self.navigationItem setSearchController:searchBar.searchController];
            [self.navigationItem setHidesSearchBarWhenScrolling:searchBar.hideWhenScrolling];
        }
    }
    NSInteger crumb = [self.navigationController.viewControllers indexOfObject:self];
    UIViewController *previousController = crumb > 0 ? [self.navigationController.viewControllers objectAtIndex:crumb - 1] : nil;
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
    NVStatusBarView *statusBar = [navigationBar viewWithTag:STATUS_BAR];
    self.statusBarStyle = statusBar.tintStyle;
    self.statusBarHidden = statusBar.hidden;
    [statusBar updateStyle];
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
    NVStatusBarView *statusBar = [navigationBar viewWithTag:STATUS_BAR];
    [navigationBar updateStyle];
    [statusBar updateStyle];
}

- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    if (self.boundsDidChangeBlock && !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
        self.boundsDidChangeBlock(self);
        _lastViewFrame = self.view.frame;
    }
}

- (UIViewController *)childViewControllerForStatusBarStyle
{
    return [[self childViewControllers] lastObject];
}

- (UIViewController *)childViewControllerForStatusBarHidden
{
    return [[self childViewControllers] lastObject];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return self.statusBarStyle;
}

- (BOOL)prefersStatusBarHidden
{
    return self.statusBarHidden;
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
