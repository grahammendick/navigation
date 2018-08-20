#import "NVRightBarView.h"

#import <React/UIView+React.h>

@implementation NVRightBarView

-(void)setBarButtons:(NSMutableArray *)buttons
{
    [self.reactViewController.navigationItem setRightBarButtonItems:buttons];
}

@end
