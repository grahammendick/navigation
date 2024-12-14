#import "NVSharedElementView.h"
#import "NVSceneView.h"

@implementation NVSharedElementView

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    if (![[self getScene].sharedElements containsObject:self])
        [[self getScene].sharedElements addObject:self];
}

- (void)willMoveToSuperview:(UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview)
        [[self getScene].sharedElements removeObject:self];
}

- (NVSceneView*) getScene
{
    UIView *parentView = (UIView *)self.superview;
    while (parentView) {
        if ([parentView isKindOfClass:[NVSceneView class]]) {
            return (NVSceneView*) parentView;;
        }
        parentView = parentView.superview;
    }
    return nil;
}

@end
