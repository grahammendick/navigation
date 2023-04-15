#import "NVSceneView.h"
#import <React/UIView+React.h>

@implementation NVSceneView
{
    BOOL _notifiedPeekable;
    BOOL _landscape;
}

- (id)init
{
    if (self = [super init]) {
    }
    return self;
}

- (void)setLandscape:(BOOL)landscape
{
    if (landscape != _landscape) {
        _landscape = landscape;
        [self setOrientation];
    }
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self setOrientation];
}

- (void)setOrientation {
    if (self.reactViewController && self.reactViewController == self.reactViewController.navigationController.topViewController) {
        [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:[self interfaceOrientation]] forKey:@"orientation"];
    }
}

- (int)interfaceOrientation
{
    UIDeviceOrientation deviceOrientation = [[UIDevice currentDevice] orientation];
    if (_landscape) {
        return deviceOrientation != UIDeviceOrientationLandscapeLeft ? UIInterfaceOrientationLandscapeLeft : UIInterfaceOrientationLandscapeRight;
    }
    switch (deviceOrientation) {
        case UIDeviceOrientationPortrait:
          return UIInterfaceOrientationPortrait;
        case UIDeviceOrientationPortraitUpsideDown:
          return UIInterfaceOrientationPortraitUpsideDown;
        case UIDeviceOrientationLandscapeLeft:
          return UIInterfaceOrientationLandscapeRight;
        case UIDeviceOrientationLandscapeRight:
          return UIInterfaceOrientationLandscapeLeft;
        default:
          return UIInterfaceOrientationUnknown;
    }
}

-(void)didPop
{
    self.onPopped(nil);
}

- (void)didUpdateReactSubviews
{
    [super didUpdateReactSubviews];
    if (!_notifiedPeekable && self.subviews.count > 0) {
        _notifiedPeekable = YES;
        if (self.peekableDidChangeBlock) {
            self.peekableDidChangeBlock();
        }
    }
}

@end
