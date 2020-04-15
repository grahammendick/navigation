#import "NVSegmentedControlView.h"

@implementation NVSegmentedControlView

- (void)setTitles:(NSArray<NSString *> *)titles
{
  [self removeAllSegments];
  for (NSString *title in titles) {
    [self insertSegmentWithTitle:title atIndex:self.numberOfSegments animated:NO];
  }
}

@end
