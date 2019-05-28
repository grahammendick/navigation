#import "NVSearchResultsController.h"

@implementation NVSearchResultsController
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

@end
