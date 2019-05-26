#import "NVSearchBarView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVSearchBarView
{
    UIViewController *_viewController;
}

- (id)init
{
    if (self = [super initWithFrame:CGRectZero]) {
        _viewController = [UIViewController new];
        _viewController.view = [UIView new];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [_viewController.view insertSubview:subview atIndex:0];
}

- (void)didUpdateReactSubviews
{
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    UINavigationItem *navigationItem = self.reactViewController.navigationItem;
    if ([[navigationItem searchController] searchResultsController] == _viewController)
        return;
    UISearchController *searchController = [[UISearchController alloc] initWithSearchResultsController:_viewController];
    self.reactViewController.definesPresentationContext = YES;
    [navigationItem setSearchController:searchController];
    [navigationItem setHidesSearchBarWhenScrolling:self.hidesWhenScrolling];
}


@end
