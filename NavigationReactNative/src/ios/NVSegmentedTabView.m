#import "NVSegmentedTabView.h"
#import "NVTabBarItemView.h"
#import "NVTabBarPagerView.h"

#import <React/RCTFont.h>
#import <React/RCTI18nUtil.h>

@implementation NVSegmentedTabView
{
    NSMutableDictionary<NSValue *, NSString *> *segmentTestIDs;
}

- (id)init
{
    if (self = [super init]) {
        [self addTarget:self action:@selector(tabPressed) forControlEvents:UIControlEventValueChanged];
        self.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
    }
    return self;
}

- (void)setTabs:(NSArray<NSDictionary *> *)tabs
{
    segmentTestIDs = [[NSMutableDictionary alloc] init];
    NSInteger selectedIndex = self.selectedSegmentIndex;
    [self removeAllSegments];
    for (NSDictionary *tab in tabs) {
        NSUInteger index = self.numberOfSegments;
        [self insertSegmentWithTitle:tab[@"title"] atIndex:index animated:NO];
        UIView *segment = [self subviews][index];
        if (segment) {
            segmentTestIDs[[NSValue valueWithNonretainedObject:segment]] = tab[@"testID"];
        }
    }
    self.selectedSegmentIndex = selectedIndex;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    for (UIView *view in [self subviews]) {
        if ([view isKindOfClass:NSClassFromString(@"UISegment")]) {
            for (UIView *child in [view subviews]) {
                child.accessibilityIdentifier = segmentTestIDs[[NSValue valueWithNonretainedObject:view]];
            }
        }
    }
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
        NSMutableDictionary *attributes = [NSMutableDictionary new];
        if (selectedTintColor != nil) {
            attributes[NSForegroundColorAttributeName] = selectedTintColor;
        }
        [self setTitleTextAttributes:attributes forState:UIControlStateSelected];
    }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
    NSNumber *size = !self.fontSize ? @13 : self.fontSize;
    UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:self.fontWeight style:self.fontStyle variant:nil scaleMultiplier:1];
    NSMutableDictionary *attributes = [NSMutableDictionary new];
    if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
        attributes[NSFontAttributeName] = font;
    }
    if (@available(iOS 13.0, *)) {
        if (self.unselectedTintColor != nil) {
            attributes[NSForegroundColorAttributeName] = self.unselectedTintColor;
        }
    }
    [self setTitleTextAttributes:attributes forState:UIControlStateNormal];
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
