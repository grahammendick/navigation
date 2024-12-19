#import "NVSharedElementView.h"
#import "NVSceneController.h"
#import <React/UIView+React.h>

@implementation NVSharedElementView

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [((NVSharedElementController *) self.reactViewController).sharedElements addObject:self];
}

- (void)willMoveToSuperview:(UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview)
        [((NVSharedElementController *) self.reactViewController).sharedElements removeObject:self];
}

@end
