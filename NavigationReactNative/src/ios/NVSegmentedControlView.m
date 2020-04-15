#import "NVSegmentedControlView.h"

@implementation NVSegmentedControlView
{
    NSInteger _selectedIndex;
}

- (void)setTitles:(NSArray<NSString *> *)titles
{

    [self removeAllSegments];
    for (NSString *title in titles) {
        [self insertSegmentWithTitle:title atIndex:self.numberOfSegments animated:NO];
    }
    self.selectedSegmentIndex = _selectedIndex;
}

@end
