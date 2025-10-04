#import "NVRightBarView.h"

#import <React/UIView+React.h>
#import "NVBarButtonView.h"

@implementation NVRightBarView

-(void)setBarButtons:(NSMutableArray *)buttons
{
    NSMutableArray *barButtons = [NSMutableArray arrayWithCapacity:buttons.count];
    for (NVBarButtonView *button in buttons) {
        [barButtons addObject:button.button];
    }
    [self.reactViewController.navigationItem setRightBarButtonItems:barButtons];
}

@end
