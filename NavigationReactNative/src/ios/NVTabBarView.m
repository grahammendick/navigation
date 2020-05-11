#import "NVTabBarView.h"
#import "NVTabBarItemView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVTabBarView
{
    UITabBarController *_tabBarController;
    NSInteger _selectedTab;
}

- (id)init
{
    if (self = [super init]) {
        _tabBarController = [[UITabBarController alloc] init];
        [self addSubview:_tabBarController.view];
        _tabBarController.delegate = self;
    }
    return self;
}

- (void)setSelectedTab:(NSInteger)selectedTab
{
    _selectedTab = selectedTab;
}

- (void)setBarTintColor:(UIColor *)barTintColor
{
    [_tabBarController.tabBar setBarTintColor:barTintColor];
}

- (void)setSelectedTintColor:(UIColor *)selectedTintColor
{
    [_tabBarController.tabBar setTintColor: selectedTintColor];
}

- (void)setUnselectedTintColor:(UIColor *)unselectedTintColor
{
    [_tabBarController.tabBar setUnselectedItemTintColor: unselectedTintColor];
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [_tabBarController addChildViewController:[(NVTabBarItemView *) subview navigationController]];
}

- (void)removeReactSubview:(UIView *)subview
{
    NSInteger tab = [self.reactSubviews indexOfObject:subview];
    [super removeReactSubview:subview];
    NSMutableArray *controllers = [NSMutableArray arrayWithArray:[_tabBarController viewControllers]];
    [controllers removeObjectAtIndex:tab];
    [_tabBarController setViewControllers:controllers];
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if (_tabBarController.selectedIndex == NSNotFound) {
        _tabBarController.selectedIndex = 0;
    }
    if (_tabBarController.selectedIndex != _selectedTab) {
        _tabBarController.selectedIndex = _selectedTab;
        [self selectTab];
    }
}

- (void)didUpdateReactSubviews
{
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _tabBarController.view.frame = self.bounds;
}

- (void)dealloc
{
    _tabBarController.delegate = nil;
}

- (void)tabBarController:(UITabBarController *)tabBarController didSelectViewController:(nonnull UIViewController *)viewController
{
    _selectedTab = [tabBarController.viewControllers indexOfObject:viewController];
    [self selectTab];
}

-(void) selectTab
{
    NVTabBarItemView *tabBarItem = (NVTabBarItemView *)self.reactSubviews[_selectedTab];
    self.onTabSelected(@{ @"tab": @(_selectedTab) });
    if (!!tabBarItem.onPress) {
        tabBarItem.onPress(nil);
    }
}

@end
