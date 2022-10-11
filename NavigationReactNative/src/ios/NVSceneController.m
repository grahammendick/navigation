#import "NVSceneController.h"
#import "NVSceneView.h"
#import "NVNavigationBarView.h"
#import "NVSearchBarView.h"
#import "NVStatusBarView.h"
#import <React/UIView+React.h>

@implementation NVSceneController
{
    UIView<NVScene> *_view;
    CGRect _lastViewFrame;
}

- (id)initWithScene:(UIView<NVScene> *)view
{
    if (self = [super init]) {
        _view = view;
    }
    return self;
}

- (void)loadView
{
    [super loadView];
    _view.reactViewController.view = nil;
    self.view = _view;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    UIView<NVNavigationBar> *navigationBar = [self findNavigationBar:self.view];
    UIView<NVSearchBar> *searchBar = [self findSearchBar:navigationBar];
    self.definesPresentationContext = true;
    if (!!searchBar && !navigationBar.isHidden) {
        [self.navigationItem setSearchController:searchBar.searchController];
        [self.navigationItem setHidesSearchBarWhenScrolling:searchBar.hideWhenScrolling];
    }
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    NSInteger crumb = [self.navigationController.viewControllers indexOfObject:self];
    UIViewController *previousController = crumb > 0 ? [self.navigationController.viewControllers objectAtIndex:crumb - 1] : nil;
    UIView<NVNavigationBar> *navigationBar = [self findNavigationBar:self.view];
    navigationBar.backImageDidLoadBlock = nil;
    BOOL hidden = navigationBar.isHidden;
    if (@available(iOS 13.0, *)) {
    } else {
        hidden = hidden || previousController.navigationItem.searchController.active;
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
    self.navigationController.navigationBar.prefersLargeTitles = true;
    [self.navigationItem setLargeTitleDisplayMode:navigationBar.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever];
    UIView<NVSearchBar> *searchBar = [self findSearchBar:navigationBar];
    self.definesPresentationContext = true;
    if (!!searchBar && !navigationBar.hidden) {
        [self.navigationItem setSearchController:searchBar.searchController];
        [self.navigationItem setHidesSearchBarWhenScrolling:searchBar.hideWhenScrolling];
    }
    UIView<NVStatusBar> *statusBar = [self findStatusBar:navigationBar];
    self.statusBarStyle = statusBar.tintStyle;
    self.statusBarHidden = statusBar.hidden;
    [statusBar updateStyle];
}

- (void)viewWillLayoutSubviews
{
    [super viewWillLayoutSubviews];
    NSInteger crumb = [self.navigationController.viewControllers indexOfObject:self];
    UIViewController *previousController = crumb > 0 ? [self.navigationController.viewControllers objectAtIndex:crumb - 1] : nil;
    UIView<NVNavigationBar> *navigationBar = [self findNavigationBar:self.view];
    if (previousController.navigationItem.searchController.active) {
        [self.navigationController setNavigationBarHidden:navigationBar.isHidden];
    }
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    UIView<NVNavigationBar> *navigationBar = [self findNavigationBar:self.view];
    UIView<NVStatusBar> *statusBar = [self findStatusBar:navigationBar];
    [navigationBar updateStyle];
    [statusBar updateStyle];
}

-(UIView<NVNavigationBar> *) findNavigationBar:(UIView *)parent
{
    return (UIView<NVNavigationBar> *) [self findChild:parent of:@protocol(NVNavigationBar)];
}

-(UIView<NVSearchBar> *) findSearchBar:(UIView *)parent
{
    return (UIView<NVSearchBar> *) [self findChild:parent of:@protocol(NVSearchBar)];
}

-(UIView<NVStatusBar> *) findStatusBar:(UIView *)parent
{
    return (UIView<NVStatusBar> *) [self findChild:parent of:@protocol(NVStatusBar)];
}

-(UIView *) findChild:(UIView *)parent of:(Protocol*) proto
{
    for(NSInteger i = 0; i < parent.subviews.count; i++) {
        UIView* subview = parent.subviews[i];
        if ([subview conformsToProtocol:proto])
            return subview;
        subview = [self findChild:parent.subviews[i] of:proto];
        if ([subview conformsToProtocol:proto])
            return subview;
    }
    return nil;
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
    return NO;
}

- (void)dealloc
{
    [_view didPop];
}

@end
