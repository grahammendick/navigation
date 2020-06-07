#import "NVSegmentedTabView.h"
#import "NVTabBarItemView.h"

#import <React/UIView+React.h>
#import <React/RCTScrollView.h>

@implementation NVSegmentedTabView
{
    NSInteger _selectedTab;
    NVTabBarItemView *_selectedTabBarItem;
    NSInteger _nativeEventCount;
}

- (id)init
{
    if (self = [super init]) {
        _selectedTab = 0;
        [self addTarget:self action:@selector(tabPressed) forControlEvents:UIControlEventValueChanged];
    }
    return self;
}

- (void)setSelectedTab:(NSInteger)selectedTab
{
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag == 0) {
        _selectedTab = selectedTab;
    }
}

- (void)setTitles:(NSArray<NSString *> *)titles
{
    [self removeAllSegments];
    for (NSString *title in titles) {
        [self insertSegmentWithTitle:title atIndex:self.numberOfSegments animated:NO];
    }
    self.selectedSegmentIndex = _selectedTab;
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
        NSMutableDictionary *titleAttributes = [[self titleTextAttributesForState:UIControlStateSelected] mutableCopy];
        if (titleAttributes == nil) {
            titleAttributes = @{}.mutableCopy;
        }
        [titleAttributes removeObjectForKey:NSForegroundColorAttributeName];
        if (selectedTintColor != nil) {
            titleAttributes[NSForegroundColorAttributeName] = selectedTintColor;
        }
        [self setTitleTextAttributes:titleAttributes forState:UIControlStateSelected];
    }
}

- (void)setUnselectedTintColor:(UIColor *)unselectedTintColor
{
    if (@available(iOS 13.0, *)) {
        NSMutableDictionary *titleAttributes = [[self titleTextAttributesForState:UIControlStateNormal] mutableCopy];
        if (titleAttributes == nil) {
            titleAttributes = @{}.mutableCopy;
        }
        [titleAttributes removeObjectForKey:NSForegroundColorAttributeName];
        if (unselectedTintColor != nil) {
            titleAttributes[NSForegroundColorAttributeName] = unselectedTintColor;
        }
        [self setTitleTextAttributes:titleAttributes forState:UIControlStateNormal];
    }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    BOOL press = self.selectedSegmentIndex != _selectedTab;
    self.selectedSegmentIndex = _selectedTab;
    [self selectTab:press];
}

- (void)scrollToTop
{
    UIView *tabBarItem = _selectedTabBarItem.subviews[0];
    if ([tabBarItem isKindOfClass:[RCTScrollView class]]) {
        UIScrollView *scrollView = ((RCTScrollView *) tabBarItem).scrollView;
        [scrollView setContentOffset:CGPointMake(0, 0) animated:YES];
    }
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    if (!!self.window) {
        [self selectTab:_selectedTabBarItem == nil && self.selectedSegmentIndex > 0];
    }
}

- (void)tabPressed
{
    [self selectTab:YES];
}

- (void)selectTab:(BOOL) press
{
    BOOL tabChanged = press;
    NSInteger tabBarIndex = [self.superview.subviews indexOfObject:self] + (self.bottomTabs ? -1 : 1);
    UIView* tabBar = [self.superview.subviews objectAtIndex:tabBarIndex];
    if (!press) {
        NSInteger reselectedTab = [tabBar.reactSubviews indexOfObject:_selectedTabBarItem];
        self.selectedSegmentIndex = reselectedTab != NSNotFound ? reselectedTab : MAX(self.selectedSegmentIndex, 0);
        tabChanged = _selectedTab != self.selectedSegmentIndex;
    }
    if (tabChanged) {
        _nativeEventCount++;
        self.onTabSelected(@{
            @"tab": @(self.selectedSegmentIndex),
            @"eventCount": @(_nativeEventCount),
        });
    }
    for(NSInteger i = 0; i < [tabBar.reactSubviews count]; i++) {
        NVTabBarItemView *tabBarItem = (NVTabBarItemView *) [tabBar.reactSubviews objectAtIndex:i];
        tabBarItem.alpha = (i == self.selectedSegmentIndex ? 1 : 0);
        if (i == self.selectedSegmentIndex) {
            _selectedTab = i;
            _selectedTabBarItem = tabBarItem;
            if (tabChanged && !!tabBarItem.onPress)
                tabBarItem.onPress(nil);
        }
    }
}

@end
