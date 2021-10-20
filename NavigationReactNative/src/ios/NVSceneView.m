#import "NVSceneView.h"
#import <React/UIView+React.h>

@implementation NVSceneView
{
    BOOL _notifiedPeekable;
}

- (id)init
{
    if (self = [super init]) {
    }
    return self;
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
