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
    if ([self.reactViewController isKindOfClass:[NVSceneController class]]) {
        [((NVSceneController *) self.reactViewController) statusBarDidUpdate:self];
    }
}

@end
