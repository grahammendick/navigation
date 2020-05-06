#import "NVSegmentedTabView.h"
#import "NVTabBarItemView.h"

#import <React/UIView+React.h>

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
    NSInteger selectedSegmentIndex = MAX(0, self.selectedSegmentIndex);
    [self removeAllSegments];
    for (NSString *title in titles) {
        [self insertSegmentWithTitle:title atIndex:self.numberOfSegments animated:NO];
    }
    self.selectedSegmentIndex = selectedSegmentIndex < self.numberOfSegments ? selectedSegmentIndex : 0;
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
    [self selectTab:NO];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    if (!!self.window)
        [self selectTab:NO];
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
        NSInteger selectedSegmentIndex = [tabBar.reactSubviews indexOfObjectPassingTest:^BOOL(UIView * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            return [(NVTabBarItemView *) obj selected];
        }];
        if (selectedSegmentIndex != self.selectedSegmentIndex){
            self.selectedSegmentIndex = selectedSegmentIndex;
            tabChanged = YES;
        }
    }
    if (self.selectedSegmentIndex == NSNotFound) {
        tabChanged = YES;
        self.selectedSegmentIndex = 0;
    }
    for(NSInteger i = 0; i < [tabBar.reactSubviews count]; i++) {
        NVTabBarItemView *tabBarItem = (NVTabBarItemView *) [tabBar.reactSubviews objectAtIndex:i];
        tabBarItem.alpha = (i == self.selectedSegmentIndex ? 1 : 0);
        tabBarItem.selected = i == self.selectedSegmentIndex;
        if (tabChanged && i == self.selectedSegmentIndex && !!tabBarItem.onPress) {
            tabBarItem.onPress(nil);
        }
    }
}

@end
