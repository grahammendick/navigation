#import "NVNavigationBarView.h"

#import "NVSceneController.h"

#import <React/RCTBridge.h>
#import <React/RCTFont.h>
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wnullability-completeness"
#import <React/RCTImageLoaderProtocol.h>
#pragma clang diagnostic pop
#import <React/RCTImageSource.h>
#import <React/UIView+React.h>

@implementation NVNavigationBarView
{
    __weak RCTBridge *_bridge;
    UIImage *_backImage;
    BOOL addedListener;
}

- (id)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super init]) {
        _bridge = bridge;
    }
    return self;
}

- (void)setBackImage:(RCTImageSource *)source
{
    if (!!source) {
        if (@available(iOS 13.0, *)) {
            UIImage *sfSymbol = [UIImage systemImageNamed:[source.request.URL lastPathComponent]];
            if (sfSymbol) {
                _backImage = sfSymbol;
                [self updateStyle];
                return;
            }
        }
        _backImageLoading = YES;
        [[_bridge moduleForName:@"ImageLoader"] loadImageWithURLRequest:source.request size:source.size scale:source.scale clipped:NO resizeMode:RCTResizeModeCover progressBlock:^(int64_t progress, int64_t total){} partialLoadBlock:^(UIImage *image){} completionBlock:^(NSError *error, UIImage *image) {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (self.backImageDidLoadBlock) {
                    self.backImageDidLoadBlock();
                    self.backImageDidLoadBlock = nil;
                }
                self ->_backImageLoading = NO;
                self ->_backImage = image;
                [self updateStyle];
            });
        }];
    } else {
        _backImage = nil;
        [self updateStyle];
    }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [super didSetProps:changedProps];
    if (!addedListener) {
        addedListener = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(receiveFind:) name:[@"findNavigationBar" stringByAppendingString: [_crumb stringValue]] object:nil];
    }
    if (self.reactViewController == self.reactViewController.navigationController.topViewController) {
        [self.reactViewController.navigationController setNavigationBarHidden:self.isHidden];
    }
    if ([changedProps containsObject:@"title"]) {
        [self.reactViewController.navigationItem setTitle:self.title];
    }
    if ([changedProps containsObject:@"backTitle"]) {
        UINavigationItem *previousNavigationItem = [self previousNavigationItem];
        previousNavigationItem.backBarButtonItem = nil;
        if (self.backTitle != nil) {
            previousNavigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:self.backTitle style:UIBarButtonItemStylePlain target:nil action:nil];
        }
    }
    [self updateStyle];
}

- (void) receiveFind:(NSNotification *) notification
{
    NVFindNavigationBarNotification *findNavigationBarNotification = (NVFindNavigationBarNotification *) notification.object;
    UIView *ancestor = self;
    while(ancestor) {
        if (ancestor == findNavigationBarNotification.scene)
            findNavigationBarNotification.navigationBar = self;
        ancestor = ancestor.superview;
    }
}

- (void)updateStyle {
    UINavigationBar *navigationBar;
    if (self.reactViewController == self.reactViewController.navigationController.topViewController) {
        navigationBar = self.reactViewController.navigationController.navigationBar;
    }
    if (@available(iOS 13.0, *)) {
        [navigationBar setTintColor: self.tintColor];
        self.reactViewController.navigationItem.standardAppearance = [self appearance: self.barTintColor];
        self.reactViewController.navigationItem.scrollEdgeAppearance = self.largeBarTintColor ? [self appearance: self.largeBarTintColor] : nil;
    } else {
        bool transparent = self.barTintColor && CGColorGetAlpha(self.barTintColor.CGColor) == 0;
        [navigationBar setValue:@(transparent) forKey:@"hidesShadow"];
        [navigationBar setBackgroundImage:(transparent ? [UIImage new] : nil) forBarMetrics:UIBarMetricsDefault];
        [navigationBar setBarTintColor:self.barTintColor];
        [navigationBar setTintColor: self.tintColor];
        [navigationBar setTitleTextAttributes:[self titleAttributes]];
        if (@available(iOS 11.0, *)) {
            [navigationBar setLargeTitleTextAttributes:[self largeTitleAttributes]];
        }
        UINavigationItem *previousNavigationItem = [self previousNavigationItem];
        NSMutableDictionary *backAttributes = [self backAttributes];
        if ([backAttributes objectForKey:NSFontAttributeName]) {
            NSString *title = self.backTitle ? self.backTitle : previousNavigationItem.title;
            previousNavigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:title style:UIBarButtonItemStylePlain target:nil action:nil];
        }
        [previousNavigationItem.backBarButtonItem setTitleTextAttributes:backAttributes forState:UIControlStateNormal];
        [previousNavigationItem.backBarButtonItem setTitleTextAttributes:backAttributes forState:UIControlStateSelected];
    }
    for (UIView *view in [navigationBar subviews]) {
        if ([view isKindOfClass:NSClassFromString(@"_UINavigationBarContentView")]) {
            for (UIView *child in [view subviews]) {
                if ([child isKindOfClass:NSClassFromString(@"_UIButtonBarButton")]) {
                    child.accessibilityIdentifier = self.backTestID;
                }
            }
        }
    }
}

- (UINavigationBarAppearance *) appearance: (UIColor *) color
API_AVAILABLE(ios(13.0)){
    UINavigationBarAppearance *appearance = [UINavigationBarAppearance new];
    [appearance configureWithDefaultBackground];
    if (color) {
        if (CGColorGetAlpha(color.CGColor) == 0)
            [appearance configureWithTransparentBackground];
        if (CGColorGetAlpha(color.CGColor) == 1)
            [appearance configureWithOpaqueBackground];
    }
    NSMutableDictionary *attributes = [NSMutableDictionary new];
    if (self.tintColor != nil) {
        attributes[NSForegroundColorAttributeName] = self.tintColor;
    }
    if (self.shadowColor) {
        [appearance setShadowColor:self.shadowColor];
    }
    [appearance setBackgroundColor:color];
    [appearance.buttonAppearance.normal setTitleTextAttributes:attributes];
    [appearance.doneButtonAppearance.normal setTitleTextAttributes:attributes];
    [appearance setTitleTextAttributes:[self titleAttributes]];
    [appearance setLargeTitleTextAttributes:[self largeTitleAttributes]];
    appearance.backButtonAppearance = [UIBarButtonItemAppearance new];
    appearance.backButtonAppearance.normal.titleTextAttributes = [self backAttributes];
    [appearance setBackIndicatorImage:_backImage transitionMaskImage:_backImage];
    return appearance;
}

- (NSMutableDictionary *) titleAttributes
{
    NSMutableDictionary *attributes = [NSMutableDictionary new];
    if (self.titleColor != nil) {
        attributes[NSForegroundColorAttributeName] = self.titleColor;
    }
    UIFont *baseFont = !self.titleFontFamily ? [UIFont preferredFontForTextStyle: UIFontTextStyleHeadline] : nil;
    NSNumber *size = !self.titleFontSize ? @([UIFont preferredFontForTextStyle: UIFontTextStyleHeadline].pointSize) : self.titleFontSize;
    UIFont *font = [RCTFont updateFont:baseFont withFamily:self.titleFontFamily size:size weight:self.titleFontWeight style:self.titleFontStyle variant:nil scaleMultiplier:1];
    if (self.titleFontFamily || self.titleFontWeight || self.titleFontStyle || self.titleFontSize) {
        attributes[NSFontAttributeName] = font;
    }
    return attributes;
}

- (NSMutableDictionary *) largeTitleAttributes
{
    NSMutableDictionary *attributes = [NSMutableDictionary new];
    if (self.largeTitleColor != nil) {
        attributes[NSForegroundColorAttributeName] = self.largeTitleColor;
    }
    if (@available(iOS 11.0, *)) {
        UIFont *baseFont = !self.largeTitleFontFamily ? [UIFont preferredFontForTextStyle: UIFontTextStyleLargeTitle] : nil;
        NSNumber *size = !self.largeTitleFontSize ? @([UIFont preferredFontForTextStyle: UIFontTextStyleLargeTitle].pointSize) : self.largeTitleFontSize;
        UIFont *font = [RCTFont updateFont:baseFont withFamily:self.largeTitleFontFamily size:size weight:self.largeTitleFontWeight style:self.largeTitleFontStyle variant:nil scaleMultiplier:1];
        if (self.largeTitleFontFamily || self.largeTitleFontWeight || self.largeTitleFontStyle || self.largeTitleFontSize) {
            attributes[NSFontAttributeName] = font;
        }
    }
    return attributes;
}

- (UINavigationItem *) previousNavigationItem {
    NSInteger crumb = [self.reactViewController.navigationController.viewControllers indexOfObject:self.reactViewController];
    if (crumb > 0)
        return [self.reactViewController.navigationController.viewControllers objectAtIndex:crumb - 1].navigationItem;
    return nil;
}

- (NSMutableDictionary *) backAttributes
{
    NSMutableDictionary *attributes = [NSMutableDictionary new];
    UIFont *baseFont = !self.backFontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
    NSNumber *size = !self.backFontSize ? @(UIFont.labelFontSize) : self.backFontSize;
    UIFont *font = [RCTFont updateFont:baseFont withFamily:self.backFontFamily size:size weight:self.backFontWeight style:self.backFontStyle variant:nil scaleMultiplier:1];
    if (self.backFontFamily || self.backFontWeight || self.backFontStyle || self.backFontSize) {
        attributes[NSFontAttributeName] = font;
    }
    return attributes;
}

- (void) dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
