#import "NVLeftBarView.h"

#import <React/UIView+React.h>
#import "NVBarButtonView.h"

@implementation NVLeftBarView

-(void)setBarButtons:(NSMutableArray *)buttons
{
    NSMutableArray *barButtons = [NSMutableArray arrayWithCapacity:buttons.count];
    for (NVBarButtonView *button in buttons) {
        [barButtons addObject:button.button];
    }
    [self.reactViewController.navigationItem setLeftBarButtonItems:barButtons];
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [self.reactViewController.navigationItem setLeftItemsSupplementBackButton:self.supplementBack];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self.reactViewController.navigationItem setLeftItemsSupplementBackButton:self.supplementBack];
}

@end
