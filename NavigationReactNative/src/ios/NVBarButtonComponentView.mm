#ifdef RCT_NEW_ARCH_ENABLED
#import "NVBarButtonComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTFont.h>

using namespace facebook::react;

@interface NVBarButtonComponentView () <RCTNVBarButtonViewProtocol>
@end

@implementation NVBarButtonComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVBarButtonProps>();
        _props = defaultProps;
        self.button = [[UIBarButtonItem alloc] init];
        self.button.style = UIBarButtonItemStylePlain;
        self.button.target = self;
        self.button.action = @selector(buttonPressed);
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<NVBarButtonProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<NVBarButtonProps const>(props);
    NSString *title = [[NSString alloc] initWithUTF8String: newViewProps.title.c_str()];
    _fontFamily = [[NSString alloc] initWithUTF8String: newViewProps.fontFamily.c_str()];
    _fontFamily = _fontFamily.length ? _fontFamily : nil;
    _fontWeight = [[NSString alloc] initWithUTF8String: newViewProps.fontWeight.c_str()];
    _fontWeight = _fontWeight.length ? _fontWeight : nil;
    _fontStyle = [[NSString alloc] initWithUTF8String: newViewProps.fontStyle.c_str()];
    _fontStyle = _fontStyle.length ? _fontStyle : nil;
    _fontSize = @(newViewProps.fontSize);
    _fontSize = [_fontSize intValue] >= 0 ? _fontSize : nil;
    if (self.button.title != title)
        self.button.title = title;
    if (oldViewProps.fontFamily != newViewProps.fontFamily || oldViewProps.fontWeight != newViewProps.fontWeight || oldViewProps.fontStyle != newViewProps.fontStyle || oldViewProps.fontSize != newViewProps.fontSize) {
        UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
        NSNumber *size = !self.fontSize ? @(UIFont.labelFontSize) : self.fontSize;
        UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:self.fontWeight style:self.fontStyle variant:nil scaleMultiplier:1];
        NSMutableDictionary *attributes = [NSMutableDictionary new];
        if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
            attributes[NSFontAttributeName] = font;
        }
        [self.button setTitleTextAttributes:attributes forState:UIControlStateNormal];
        [self.button setTitleTextAttributes:attributes forState:UIControlStateSelected];
    }
    NSString *testID = [[NSString alloc] initWithUTF8String: newViewProps.testID.c_str()];
    if (self.button.accessibilityIdentifier != testID)
        self.button.accessibilityIdentifier = testID;
    [super updateProps:props oldProps:oldProps];
}

-(void)buttonPressed
{
    UIView *buttonView = ((UIView *) [self.button valueForKey:@"view"]);
    UIView *barView = buttonView.superview;
    UIView *labelView = buttonView.subviews.count > 0 ? buttonView.subviews[0] : buttonView;
    CGRect labelFrameInBar = [buttonView convertRect:labelView.frame toView:barView];
    self.frame = [barView convertRect:labelFrameInBar toView:nil];
    std::static_pointer_cast<NVBarButtonEventEmitter const>(_eventEmitter)
        ->onPress(NVBarButtonEventEmitter::OnPress{});
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVBarButtonComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVBarButtonCls(void)
{
  return NVBarButtonComponentView.class;
}
#endif
