#import "NVSearchBarView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVSearchBarView
{
    UISearchController *_searchController;
}

- (id)init
{
    if (self = [super initWithFrame:CGRectZero]) {
        UIViewController *viewController = [UIViewController new];
        viewController.view = [UIView new];
        _searchController = [[UISearchController alloc] initWithSearchResultsController:viewController];
    }
    return self;
}

- (void)setText:(NSString *)text
{
    [[_searchController searchBar] setText:text];
}


- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [[_searchController searchResultsController].view insertSubview:subview atIndex:0];
}

- (void)didUpdateReactSubviews
{
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    UINavigationItem *navigationItem = self.reactViewController.navigationItem;
    if ([navigationItem searchController] == _searchController)
        return;
    self.reactViewController.definesPresentationContext = YES;
    _searchController.searchResultsUpdater = self;
    [navigationItem setSearchController:_searchController];
    [navigationItem setHidesSearchBarWhenScrolling:self.hideWhenScrolling];
    [[_searchController searchBar] setAutocapitalizationType:self.autoCapitalize];
}

- (void)updateSearchResultsForSearchController:(UISearchController *)searchController {
    if (!!self.onChangeText) {
        self.onChangeText(@{@"text": searchController.searchBar.text});
    }
}

@end
