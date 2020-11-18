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

- (BOOL)viewControllerBasedStatusBarAppearance
{
    static BOOL value;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        value = [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIViewControllerBasedStatusBarAppearance"] ?: @YES boolValue];
    });
    return value;
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if (!!self.window) {
        if ([self.reactViewController isKindOfClass:[NVSceneController class]]) {
            NVSceneController *sceneController = ((NVSceneController *) self.reactViewController);
            sceneController.statusBarStyle = self.tintStyle;
            sceneController.statusBarHidden = self.hidden;
        }
        if ([self viewControllerBasedStatusBarAppearance]) {
            [UIApplication.sharedApplication.keyWindow.rootViewController setNeedsStatusBarAppearanceUpdate];
        } else {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
            [UIApplication.sharedApplication setStatusBarStyle: self.tintStyle];
            [UIApplication.sharedApplication setStatusBarHidden: self.hidden];
#pragma clang diagnostic pop
        }
    }
}

@end
