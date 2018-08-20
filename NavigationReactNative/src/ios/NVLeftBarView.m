#import "NVLeftBarView.h"

#import <React/UIView+React.h>

@implementation NVLeftBarView

-(void)setBarButtons:(NSMutableArray *)buttons
{
    [self.reactViewController.navigationItem setLeftBarButtonItems:buttons];
}

@end
