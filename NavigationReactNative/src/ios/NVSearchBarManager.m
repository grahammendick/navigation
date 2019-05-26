#import "NVSearchBarManager.h"
#import "NVSearchBarView.h"

#import <UIKit/UIKit.h>

@implementation NVSearchBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[NVSearchBarView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(hidesWhenScrolling, BOOL)


@end
