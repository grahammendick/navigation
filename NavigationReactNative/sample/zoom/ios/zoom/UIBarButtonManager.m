#import "UIBarButtonManager.h"
#import "UIBarButtonHostView.h"

@implementation UIBarButtonManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[UIBarButtonHostView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(title, NSString)

@end

