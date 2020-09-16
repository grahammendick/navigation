#import "NVNavigationBarView.h"

#import <React/RCTFont.h>
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
    NSMutableDictionary *titleAttributes = [NSMutableDictionary new];
    NSMutableDictionary *largeTitleAttributes = [NSMutableDictionary new];
    if (self.titleColor != nil) {
        titleAttributes[NSForegroundColorAttributeName] = self.titleColor;
        largeTitleAttributes[NSForegroundColorAttributeName] = self.titleColor;
    }
    UIFont *baseTitleFont = !self.titleFontFamily ? [UIFont preferredFontForTextStyle: UIFontTextStyleHeadline] : nil;
    NSNumber *titleSize = !self.titleFontSize ? @([UIFont preferredFontForTextStyle: UIFontTextStyleHeadline].pointSize) : self.titleFontSize;
    UIFont *titleFont = [RCTFont updateFont:baseTitleFont withFamily:self.titleFontFamily size:titleSize weight:self.titleFontWeight style:self.titleFontStyle variant:nil scaleMultiplier:1];
    if (self.titleFontFamily || self.titleFontWeight || self.titleFontStyle || self.titleFontSize) {
        titleAttributes[NSFontAttributeName] = titleFont;
    }
    if (@available(iOS 11.0, *)) {
        UIFont *baseLargeTitleFont = !self.titleFontFamily ? [UIFont preferredFontForTextStyle: UIFontTextStyleLargeTitle] : nil;
        NSNumber *largeTitleSize = @([UIFont preferredFontForTextStyle: UIFontTextStyleLargeTitle].pointSize);
        UIFont *largeTitlefont = [RCTFont updateFont:baseLargeTitleFont withFamily:self.titleFontFamily size:largeTitleSize weight:self.titleFontWeight style:self.titleFontStyle variant:nil scaleMultiplier:1];
        if (self.titleFontFamily || self.titleFontWeight || self.titleFontStyle) {
            largeTitleAttributes[NSFontAttributeName] = largeTitlefont;
        }
    }
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
        [appearance setTitleTextAttributes:titleAttributes];
        [appearance setLargeTitleTextAttributes:largeTitleAttributes];
        self.reactViewController.navigationItem.standardAppearance = appearance;
        self.reactViewController.navigationItem.scrollEdgeAppearance = appearance;
        self.reactViewController.navigationItem.compactAppearance = appearance;
    } else {
        bool transparent = self.barTintColor && CGColorGetAlpha(self.barTintColor.CGColor) == 0;
        [navigationBar setValue:@(transparent) forKey:@"hidesShadow"];
        [navigationBar setBackgroundImage:(transparent ? [UIImage new] : nil) forBarMetrics:UIBarMetricsDefault];
        [navigationBar setBarTintColor:self.barTintColor];
        [navigationBar setTintColor: self.tintColor];
        [navigationBar setTitleTextAttributes:titleAttributes];
        if (@available(iOS 11.0, *)) {
            [navigationBar setLargeTitleTextAttributes:largeTitleAttributes];
        }
    }
}


@end
