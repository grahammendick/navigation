#import "NVSceneController.h"
#import "NVSceneView.h"
#import "NVNavigationBarView.h"
#import "NVSearchBarView.h"

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
    NVNavigationBarView *navigationBar = (NVNavigationBarView *) [self.view viewWithTag:NAVIGATION_BAR];
    [self.navigationController setNavigationBarHidden:navigationBar.hidden];
    if (navigationBar.title.length != 0) {
        [self.navigationItem setTitle:navigationBar.title];
    }
    [navigationBar updateColors];
    NSInteger crumb = [self.navigationController.viewControllers indexOfObject:self];
    UIViewController *previousController = crumb > 0 ? [self.navigationController.viewControllers objectAtIndex:crumb - 1] : nil;
    previousController.navigationItem.backBarButtonItem = nil;
    if (navigationBar.backTitle != nil) {
        previousController.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:navigationBar.backTitle style:UIBarButtonItemStylePlain target:nil action:nil];
    }
    if (@available(iOS 11.0, *)) {
        self.navigationController.navigationBar.prefersLargeTitles = true;
        [self.navigationItem setLargeTitleDisplayMode:navigationBar.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever];
    }
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    NVNavigationBarView *navigationBar = (NVNavigationBarView *) [self.view viewWithTag:NAVIGATION_BAR];
    [navigationBar updateColors];
}

- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    if (self.boundsDidChangeBlock && !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
        self.boundsDidChangeBlock(self);
        _lastViewFrame = self.view.frame;
    }
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
