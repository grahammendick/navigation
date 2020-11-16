#import "NVStatusBarView.h"

@implementation NVStatusBarView

- (id)init
{
    if (self = [super init]) {
        self.tag = STATUS_BAR;
    }
    return self;
}

@end
