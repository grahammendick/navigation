#import "NVSegmentedControlView.h"
#import "NVTabBarItemView.h"

@implementation NVSegmentedControlView
{
    NSInteger _selectedIndex;
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

    [self removeAllSegments];
    for (NSString *title in titles) {
        [self insertSegmentWithTitle:title atIndex:self.numberOfSegments animated:NO];
    }
    self.selectedSegmentIndex = _selectedIndex;
}

- (void)setBarTintColor:(UIColor *)barTintColor
{
    [super setTintColor:barTintColor];
    if (@available(iOS 13.0, *)) {
        [self setBackgroundColor:barTintColor];
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

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self selectTab:NO];
}

- (void)tabPressed
{
    _selectedIndex = self.selectedSegmentIndex;
    [self selectTab:YES];
}

- (void)selectTab:(BOOL) press
{
    NSInteger tabBarIndex = 1 - [self.superview.subviews indexOfObject:self];
    UIView* tabBar = [self.superview.subviews objectAtIndex:tabBarIndex];
    for(NSInteger i = 0; i < [tabBar.subviews count]; i++) {
        NVTabBarItemView *tabBarItem = (NVTabBarItemView *) [tabBar.subviews objectAtIndex:i];
        tabBarItem.alpha = (i == _selectedIndex ? 1 : 0);
        if (press && i == _selectedIndex && !!tabBarItem.onPress) {
            tabBarItem.onPress(nil);
        }
    }
}

@end
