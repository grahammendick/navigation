#ifdef RCT_NEW_ARCH_ENABLED
#import "NVStatusBarComponentView.h"
#import "NVSceneController.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVStatusBarComponentView () <RCTNVStatusBarViewProtocol>
@end

@implementation NVStatusBarComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVStatusBarProps>();
        _props = defaultProps;
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<NVStatusBarProps const>(props);
    NSString *tintStyleVal = [[NSString alloc] initWithUTF8String: newViewProps.tintStyle.c_str()];
    self.tintStyle = [self statusBarStyle:tintStyleVal];
    self.hidden = newViewProps.hidden;
    if ([self.reactViewController isKindOfClass:[NVSceneController class]]) {
        NVSceneController *sceneController = ((NVSceneController *) self.reactViewController);
        sceneController.statusBarStyle = self.tintStyle;
        sceneController.statusBarHidden = self.hidden;
        [self updateStyle];
    }
    [super updateProps:props oldProps:oldProps];
}

-(UIStatusBarStyle)statusBarStyle:(NSString*)val
{
    if ([val isEqualToString:@"light-content"]) return UIStatusBarStyleLightContent;
    if (@available(iOS 13.0, *))
        if ([val isEqualToString:@"dark-content"]) return UIStatusBarStyleDarkContent;
    return UIStatusBarStyleDefault;
}

- (void)updateStyle
{
    if (self.reactViewController == self.reactViewController.navigationController.topViewController) {
        if ([self viewControllerBasedStatusBarAppearance]) {
            [UIApplication.sharedApplication.keyWindow.rootViewController setNeedsStatusBarAppearanceUpdate];
        } else {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
            [UIApplication.sharedApplication setStatusBarStyle: self.tintStyle];
            [UIApplication.sharedApplication setStatusBarHidden: self.hidden];
#pragma clang diagnostic pop
        }
    }
}

- (BOOL)viewControllerBasedStatusBarAppearance
{
    static BOOL value;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        value = [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIViewControllerBasedStatusBarAppearance"] ?: @YES boolValue];
    });
    return value;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVStatusBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVStatusBarCls(void)
{
  return NVStatusBarComponentView.class;
}
#endif
