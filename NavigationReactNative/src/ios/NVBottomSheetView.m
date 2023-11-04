#import "NVBottomSheetView.h"

#import <UIKit/UIKit.h>
#import "UIView+React.h"

@interface NVBottomSheetController : UIViewController

@end

@implementation NVBottomSheetController

@end

@implementation NVBottomSheetView
{
    NVBottomSheetController *_bottomSheetController;
    int _oldHeight;
}

- (id)init
{
    if (self = [super init]) {
        _bottomSheetController = [[NVBottomSheetController alloc] init];
        CADisplayLink *displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(updateView)];
        [displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    }
    return self;
}

- (void)updateView {
    int newHeight = [[_bottomSheetController.view.layer.presentationLayer valueForKeyPath:@"frame.size.height"] intValue];
    if (_oldHeight != newHeight) {
        NSLog(@"animated value: %d\n", newHeight);
        _oldHeight = newHeight;
    }
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    _bottomSheetController.view = subview;
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    if (@available(iOS 15.0, *)) {
        UISheetPresentationController *sheet = _bottomSheetController.sheetPresentationController;
        [sheet setDetents:@[UISheetPresentationControllerDetent.mediumDetent, UISheetPresentationControllerDetent.largeDetent]];
        [[self reactViewController] presentViewController:_bottomSheetController animated:true completion:nil];
    }
}

@end

