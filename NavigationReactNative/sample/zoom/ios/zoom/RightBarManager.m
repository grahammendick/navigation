#import "RightBarManager.h"

#import "RightBarHostView.h"

@implementation RightBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RightBarHostView alloc] init];
}

@end

