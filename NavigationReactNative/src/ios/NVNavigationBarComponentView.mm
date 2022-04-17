#ifdef RCT_NEW_ARCH_ENABLED
#import "NVNavigationBarComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTFont.h>
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVNavigationBarComponentView () <RCTNVNavigationBarViewProtocol>
@end

@implementation NVNavigationBarComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVNavigationBarProps>();
        _props = defaultProps;
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<NVNavigationBarProps const>(props);
    _isHidden = _hidden = newViewProps.hidden;
    if (self.reactViewController == self.reactViewController.navigationController.topViewController) {
        if ([self.reactViewController.navigationController isNavigationBarHidden] != self.hidden)
            [self.reactViewController.navigationController setNavigationBarHidden:self.hidden];
    }
    _largeTitle = newViewProps.largeTitle;
    _title = [[NSString alloc] initWithUTF8String: newViewProps.title.c_str()];
    if (self.reactViewController.navigationItem.title != self.title)
        [self.reactViewController.navigationItem setTitle:self.title];
    _titleFontFamily = [[NSString alloc] initWithUTF8String: newViewProps.titleFontFamily.c_str()];
    _titleFontFamily = _titleFontFamily.length ? _titleFontFamily : nil;
    _titleFontWeight = [[NSString alloc] initWithUTF8String: newViewProps.titleFontWeight.c_str()];
    _titleFontWeight = _titleFontWeight.length ? _titleFontWeight : nil;
    _titleFontStyle = [[NSString alloc] initWithUTF8String: newViewProps.titleFontStyle.c_str()];
    _titleFontStyle = _titleFontStyle.length ? _titleFontStyle : nil;
    _titleFontSize = @(newViewProps.titleFontSize);
    _titleFontSize = [_titleFontSize intValue] >= 0 ? _titleFontSize : nil;
    _largeTitleFontFamily = [[NSString alloc] initWithUTF8String: newViewProps.largeTitleFontFamily.c_str()];
    _largeTitleFontFamily = _largeTitleFontFamily.length ? _largeTitleFontFamily : nil;
    _largeTitleFontWeight = [[NSString alloc] initWithUTF8String: newViewProps.largeTitleFontWeight.c_str()];
    _largeTitleFontWeight = _largeTitleFontWeight.length ? _largeTitleFontWeight : nil;
    _largeTitleFontStyle = [[NSString alloc] initWithUTF8String: newViewProps.largeTitleFontStyle.c_str()];
    _largeTitleFontStyle = _largeTitleFontStyle.length ? _largeTitleFontStyle : nil;
    _largeTitleFontSize = @(newViewProps.largeTitleFontSize);
    _largeTitleFontSize = [_largeTitleFontSize intValue] >= 0 ? _largeTitleFontSize : nil;
    _backFontFamily = [[NSString alloc] initWithUTF8String: newViewProps.backFontFamily.c_str()];
    _backFontFamily = _backFontFamily.length ? _backFontFamily : nil;
    _backFontWeight = [[NSString alloc] initWithUTF8String: newViewProps.backFontWeight.c_str()];
    _backFontWeight = _backFontWeight.length ? _backFontWeight : nil;
    _backFontStyle = [[NSString alloc] initWithUTF8String: newViewProps.backFontStyle.c_str()];
    _backFontStyle = _backFontStyle.length ? _backFontStyle : nil;
    _backFontSize = @(newViewProps.backFontSize);
    _backFontSize = [_backFontSize intValue] >= 0 ? _backFontSize : nil;
    _barTintColor = RCTUIColorFromSharedColor(newViewProps.barTintColor);
    _largeBarTintColor = RCTUIColorFromSharedColor(newViewProps.largeBarTintColor);
    _tintColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    _titleColor = RCTUIColorFromSharedColor(newViewProps.titleColor);
    _largeTitleColor = RCTUIColorFromSharedColor(newViewProps.largeTitleColor);
    _backTitle = [[NSString alloc] initWithUTF8String: newViewProps.backTitle.c_str()];
    _backTitle = !newViewProps.backTitleOff ? _backTitle : nil;
    UINavigationItem *previousNavigationItem = [self previousNavigationItem];
    if (previousNavigationItem.backBarButtonItem.title != _backTitle) {
        previousNavigationItem.backBarButtonItem = nil;
        if (self.backTitle != nil) {
            previousNavigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:self.backTitle style:UIBarButtonItemStylePlain target:nil action:nil];
        }
    }
    _backTestID = [[NSString alloc] initWithUTF8String: newViewProps.backTestID.c_str()];
    [self updateStyle];
    [super updateProps:props oldProps:oldProps];
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
    /*for (UIView *view in [navigationBar subviews]) {
        if ([view isKindOfClass:NSClassFromString(@"_UINavigationBarContentView")]) {
            for (UIView *child in [view subviews]) {
                if ([child isKindOfClass:NSClassFromString(@"_UIButtonBarButton")]) {
                    child.accessibilityIdentifier = self.backTestID;
                }
            }
        }
    }*/
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
    [appearance setBackgroundColor:color];
    [appearance.buttonAppearance.normal setTitleTextAttributes:attributes];
    [appearance.doneButtonAppearance.normal setTitleTextAttributes:attributes];
    [appearance setTitleTextAttributes:[self titleAttributes]];
    [appearance setLargeTitleTextAttributes:[self largeTitleAttributes]];
    //appearance.backButtonAppearance = [UIBarButtonItemAppearance new];
    //appearance.backButtonAppearance.normal.titleTextAttributes = [self backAttributes];
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

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVNavigationBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVNavigationBarCls(void)
{
  return NVNavigationBarComponentView.class;
}
#endif
