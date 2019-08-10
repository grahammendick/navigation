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
    }
        
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

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        [self.reactViewController.navigationController setNavigationBarHidden:false];
    }
}

@end
