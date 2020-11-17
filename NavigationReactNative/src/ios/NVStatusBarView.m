#import "NVStatusBarView.h"
#import "NVSceneController.h"

#import <React/UIView+React.h>

@implementation NVStatusBarView

- (id)init
{
    if (self = [super init]) {
        self.tag = STATUS_BAR;
    }
    return self;
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [((NVSceneController *) self.reactViewController) statusBarDidChange:self];
}

@end
