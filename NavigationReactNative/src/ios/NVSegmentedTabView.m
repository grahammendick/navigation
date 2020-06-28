#import "NVSegmentedTabView.h"
#import "NVTabBarItemView.h"
#import "NVTabBarPagerView.h"

@implementation NVSegmentedTabView
{
    NVTabBarPagerView *_tabBarPager;
}

- (id)init
{
    if (self = [super init]) {
        [self addTarget:self action:@selector(tabPressed) forControlEvents:UIControlEventValueChanged];
    }
    return self;
}

- (void)setTitles:(NSArray<NSString *> *)titles
{
    NSInteger _selectedIndex = self.selectedSegmentIndex;
    [self removeAllSegments];
    for (NSString *title in titles) {
        [self insertSegmentWithTitle:title atIndex:self.numberOfSegments animated:NO];
    }
    self.selectedSegmentIndex = _selectedIndex;
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

-(NSDictionary *)setForeground:(UIColor *)color :(NSDictionary *)attributes
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
    for(NSInteger i = 0; !!self.window && i < [self.superview subviews].count; i++) {
        UIView *view = [self.superview subviews][i];
        if ([view isKindOfClass:[NVTabBarPagerView class]])
            [self setupWithPager:(NVTabBarPagerView *) view];
    }
}

- (void)setupWithPager:(NVTabBarPagerView *)pager
{
    _tabBarPager = pager;
    _tabBarPager.tabChange = self;
    self.selectedSegmentIndex = pager.selectedTab;
}

- (void)tabPressed
{
    [_tabBarPager setCurrentTab:self.selectedSegmentIndex];
}

- (void)tabSelected:(NSInteger)index
{
    self.selectedSegmentIndex = index;
}

@end
