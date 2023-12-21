#import "NVBottomSheetController.h"

@implementation NVBottomSheetController
{
    CGRect _lastViewFrame;
}

- (id)init
{
    if (!(self = [super init])) {
        return nil;
    }
    return self;
}

- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    if (self.boundsDidChangeBlock && !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
        self.boundsDidChangeBlock(self.view.bounds);
        _lastViewFrame = self.view.frame;
    }
}

- (void)viewDidDisappear:(BOOL)animated
{
    if (self.didDismiss) {
        dispatch_async(dispatch_get_main_queue(), ^{
            self.didDismiss();
        });
    }
}

@end
