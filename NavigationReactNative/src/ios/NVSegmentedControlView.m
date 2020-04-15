#import "NVSegmentedControlView.h"

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

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self selectTab];
}

- (void)tabPressed
{
    _selectedIndex = self.selectedSegmentIndex;
    [self selectTab];
}

- (void)selectTab
{
    UIView* tabBar = [self.superview.subviews objectAtIndex:1];
    for(NSInteger i = 0; i < [tabBar.subviews count]; i++) {
        [tabBar.subviews objectAtIndex:i].alpha = (i == _selectedIndex ? 1 : 0);
    }
}

@end
