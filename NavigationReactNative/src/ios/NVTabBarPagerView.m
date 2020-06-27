#import "NVTabBarPagerView.h"

#import <React/UIView+React.h>

@implementation NVTabBarPagerView
{
    UIPageViewController *_pageViewController;
    NSMutableArray<UIViewController *> *_tabs;
}

- (id)init
{
    if (self = [super init]) {
        _pageViewController = [[UIPageViewController alloc] init];
        [self addSubview:_pageViewController.view];
        _tabs = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    UIViewController *viewController = [[UIViewController alloc] init];
    viewController.view = subview;
    [_tabs addObject:viewController];
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    NSInteger index = 0;
    for(NSInteger i = 0; i < [_tabs count]; i++) {
        index = _tabs[i].view == subview ? i : index;
    }
    [_tabs removeObjectAtIndex:index];
}

- (void)didUpdateReactSubviews
{
    [_pageViewController setViewControllers:@[_tabs[0]] direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
}


@end
