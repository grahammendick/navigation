#import "NVNavigationBarView.h"

#import <React/UIView+React.h>

@implementation NVNavigationBarView

- (id)init
{
    if (self = [super init]) {
        self.tag = NAVIGATION_BAR;
    }
    return self;
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [super didSetProps:changedProps];
    [self.reactViewController.navigationController setNavigationBarHidden:self.hidden];
    if ([changedProps containsObject:@"title"]) {
        [self.reactViewController.navigationItem setTitle:self.title];
    } else if ([changedProps containsObject:@"backTitle"]) {
        NSInteger crumb = [self.reactViewController.navigationController.viewControllers indexOfObject:self.reactViewController];
        UIViewController *previousController = crumb > 0 ? [self.reactViewController.navigationController.viewControllers objectAtIndex:crumb - 1] : nil;
        
        previousController.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:self.backTitle style:UIBarButtonItemStyleDone target:nil action:nil];
    }
    
    [self updateColors];
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        [self.reactViewController.navigationController setNavigationBarHidden:false];
    }
}

-(void)updateColors {
    [self.reactViewController.navigationController.navigationBar setBarTintColor:self.barTintColor];
    [self.reactViewController.navigationController.navigationBar setTintColor: self.tintColor];

    NSMutableDictionary *titleAttributes = [self.reactViewController.navigationController.navigationBar.titleTextAttributes mutableCopy];
    if (titleAttributes == nil) {
        titleAttributes = @{}.mutableCopy;
    }
    [titleAttributes removeObjectForKey:NSForegroundColorAttributeName];
    if (self.titleColor != nil) {
        titleAttributes[NSForegroundColorAttributeName] = self.titleColor;
    }
    [self.reactViewController.navigationController.navigationBar setTitleTextAttributes:titleAttributes];
    
    if (@available(iOS 11.0, *)) {
        NSMutableDictionary *largeTitleTextAttributes = [self.reactViewController.navigationController.navigationBar.largeTitleTextAttributes mutableCopy];
        if (largeTitleTextAttributes == nil) {
            largeTitleTextAttributes = @{}.mutableCopy;
        }
        [largeTitleTextAttributes removeObjectForKey:NSForegroundColorAttributeName];
        if (self.titleColor != nil) {
            largeTitleTextAttributes[NSForegroundColorAttributeName] = self.titleColor;
        }
        [self.reactViewController.navigationController.navigationBar setLargeTitleTextAttributes:largeTitleTextAttributes];
    }
}

@end
