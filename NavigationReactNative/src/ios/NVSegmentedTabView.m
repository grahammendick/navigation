#import "NVSegmentedTabView.h"
#import "NVTabBarItemView.h"
#import "NVTabBarPagerView.h"

@implementation NVSegmentedTabView

- (id)init
{
    if (self = [super init]) {
        [self addTarget:self action:@selector(tabPressed) forControlEvents:UIControlEventValueChanged];
    }
    return self;
}

- (void)setTitles:(NSArray<NSString *> *)titles
{
    NSInteger selectedIndex = self.selectedSegmentIndex;
    [self removeAllSegments];
    for (NSString *title in titles) {
        [self insertSegmentWithTitle:title atIndex:self.numberOfSegments animated:NO];
    }
    self.selectedSegmentIndex = selectedIndex;
}

- (void)setBackgroundColor:(UIColor *)backgroundColor
{
    [super setTintColor:backgroundColor];
    if (@available(iOS 13.0, *)) {
        [super setBackgroundColor:backgroundColor];
    }
}

- (void)setSelectedTintColor:(UIColor *)selectedTintColor
{
    if (@available(iOS 13.0, *)) {
        NSDictionary *titleAttributes = [self setForeground:selectedTintColor :[self titleTextAttributesForState:UIControlStateSelected]];
        [self setTitleTextAttributes:titleAttributes forState:UIControlStateSelected];
    }
}

- (void)setUnselectedTintColor:(UIColor *)unselectedTintColor
{
    if (@available(iOS 13.0, *)) {
        NSDictionary *titleAttributes = [self setForeground:unselectedTintColor :[self titleTextAttributesForState:UIControlStateNormal]];
        [self setTitleTextAttributes:titleAttributes forState:UIControlStateNormal];
    }
}

- (NSDictionary *)setForeground:(UIColor *)color :(NSDictionary *)attributes
{
    NSMutableDictionary *attributesCopy = [attributes != nil ? attributes : @{} mutableCopy];
    [attributesCopy removeObjectForKey:NSForegroundColorAttributeName];
    if (color != nil) {
        attributesCopy[NSForegroundColorAttributeName] = color;
    }
    return attributesCopy;
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    NVTabBarPagerView *tabBarPager = [self getTabBarPager];
    if (!!tabBarPager)
        self.selectedSegmentIndex = tabBarPager.selectedTab;
}

- (NVTabBarPagerView *)getTabBarPager
{
    for(NSInteger i = 0; i < [self.superview subviews].count; i++) {
        UIView *view = [self.superview subviews][i];
        if ([view isKindOfClass:[NVTabBarPagerView class]])
            return (NVTabBarPagerView *) view;
    }
    return nil;
}

- (void)tabPressed
{
    [[self getTabBarPager] setCurrentTab:self.selectedSegmentIndex];
}

@end
