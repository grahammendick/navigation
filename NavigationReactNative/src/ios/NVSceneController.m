#import "NVSceneController.h"
#import "NVNavigationBarView.h"
#import "NVSearchBarView.h"

@implementation NVSceneController
{
    UIView *_view;
    CGRect _lastViewFrame;
}

- (id)initWithScene:(UIView *)view
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
    if (@available(iOS 11.0, *)) {
        self.navigationController.navigationBar.prefersLargeTitles = true;
        [self.navigationItem setLargeTitleDisplayMode:navigationBar.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever];
    }
}

- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    if (self.boundsDidChangeBlock && !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
        self.boundsDidChangeBlock(self);
        _lastViewFrame = self.view.frame;
    }
}

@end
