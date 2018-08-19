#import "UIBarButtonManager.h"

#import <React/RCTComponent.h>
#import "UIBarButtonHostView.h"

@implementation UIBarButtonManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[UIBarButtonHostView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(image, UIImage)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end

