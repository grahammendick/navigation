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
    if ([changedProps containsObject:@"backTitle"]) {
        NSInteger crumb = [self.reactViewController.navigationController.viewControllers indexOfObject:self.reactViewController];
        UIViewController *previousController = crumb > 0 ? [self.reactViewController.navigationController.viewControllers objectAtIndex:crumb - 1] : nil;
        previousController.navigationItem.backBarButtonItem = nil;
        if (self.backTitle != nil) {
            previousController.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:self.backTitle style:UIBarButtonItemStylePlain target:nil action:nil];
        }
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
    UINavigationBar *navigationBar = self.reactViewController.navigationController.navigationBar;
    if (@available(iOS 13.0, *)) {
        [navigationBar setTintColor: self.tintColor];
        UINavigationBarAppearance *appearance = [UINavigationBarAppearance new];
        bool transparent = self.barTintColor && CGColorGetAlpha(self.barTintColor.CGColor) == 0;
        [appearance configureWithDefaultBackground];
        if (transparent) {
            [appearance configureWithTransparentBackground];
        }
        NSMutableDictionary *attributes = [NSMutableDictionary new];
        if (self.tintColor != nil) {
            attributes[NSForegroundColorAttributeName] = self.tintColor;
        }
        [appearance setBackgroundColor:self.barTintColor];
        [appearance.buttonAppearance.normal setTitleTextAttributes:attributes];
        [appearance.doneButtonAppearance.normal setTitleTextAttributes:attributes];
        NSMutableDictionary *titleAttributes = [NSMutableDictionary new];
        if (self.titleColor != nil) {
            titleAttributes[NSForegroundColorAttributeName] = self.titleColor;
        }
        [appearance setTitleTextAttributes:titleAttributes];
        [appearance setLargeTitleTextAttributes:titleAttributes];
        self.reactViewController.navigationItem.standardAppearance = appearance;
        self.reactViewController.navigationItem.scrollEdgeAppearance = appearance;
        self.reactViewController.navigationItem.compactAppearance = appearance;
    } else {
        bool transparent = self.barTintColor && CGColorGetAlpha(self.barTintColor.CGColor) == 0;
        [navigationBar setValue:@(transparent) forKey:@"hidesShadow"];
        [navigationBar setBackgroundImage:(transparent ? [UIImage new] : nil) forBarMetrics:UIBarMetricsDefault];
        [navigationBar setBarTintColor:self.barTintColor];
        [navigationBar setTintColor: self.tintColor];
        NSMutableDictionary *attributes = [NSMutableDictionary new];
        if (self.titleColor != nil) {
            attributes[NSForegroundColorAttributeName] = self.titleColor;
        }
        [navigationBar setTitleTextAttributes:attributes];
        if (@available(iOS 11.0, *)) {
            [navigationBar setLargeTitleTextAttributes:attributes];
        }
    }
}


@end
