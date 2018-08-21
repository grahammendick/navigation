#import "NVBarButtonManager.h"
#import "NVBarButtonView.h"

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@implementation NVBarButtonManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVBarButtonView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(image, UIImage)
RCT_EXPORT_VIEW_PROPERTY(systemItem, UIBarButtonSystemItem)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end
