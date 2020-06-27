#import "NVTabBarPagerView.h"

@implementation NVTabBarPagerView
{
    UIPageViewController *_pageViewController;
    NSArray<UIViewController *> *_tabs;
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

@end
