#import "NVSearchBarView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVSearchBarView
{
    UIViewController *_viewController;
}

- (id)init
{
    if (self = [super init]) {
        _viewController = [UIViewController new];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [_viewController.view insertSubview:subview atIndex:0];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    UINavigationItem *navigationItem = self.reactViewController.navigationItem;
    if ([[navigationItem searchController] searchResultsController] == _viewController)
        return;
    UISearchController *searchController = [[UISearchController alloc] initWithSearchResultsController:_viewController];
    [navigationItem setSearchController:searchController];
    [navigationItem setHidesSearchBarWhenScrolling:NO];
}


@end
