#import "NVLeftBarView.h"

#import <React/UIView+React.h>

@implementation NVLeftBarView

-(void)setBarButtons:(NSMutableArray *)buttons
{
    [self.reactViewController.navigationItem setLeftBarButtonItems:buttons];
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
