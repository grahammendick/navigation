#ifdef RCT_NEW_ARCH_ENABLED
#import "NVNavigationStackComponentView.h"
#import "NVSceneComponentView.h"
#import "NVNavigationStackView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTI18nUtil.h>

using namespace facebook::react;

@interface NVNavigationStackComponentView () <RCTNVNavigationStackViewProtocol>
@end

@implementation NVNavigationStackComponentView
{
    NSMutableDictionary *_scenes;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVNavigationStackProps>();
        _props = defaultProps;
        _navigationController = [[NVStackController alloc] init];
        _navigationController.view.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        _navigationController.navigationBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        [self addSubview:_navigationController.view];
        _navigationController.delegate = self;
        _scenes = [[NSMutableDictionary alloc] init];
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<NVNavigationStackProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<NVNavigationStackProps const>(props);

    if (oldViewProps.keys != newViewProps.keys) {
        NSMutableArray *keysArr = [[NSMutableArray alloc] init];
        for (auto i = 0; i < newViewProps.keys.size(); i++) {
            NSString *key = [[NSString alloc] initWithUTF8String: newViewProps.keys[i].c_str()];
            [keysArr addObject:key];
        }
        self.keys = [keysArr copy];
    }

    [super updateProps:props oldProps:oldProps];
}


#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVNavigationStackComponentDescriptor>();
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    _scenes[((NVSceneComponentView *) childComponentView).sceneKey] = childComponentView;
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [_scenes removeObjectForKey:((NVSceneComponentView *) childComponentView).sceneKey];
}

@end

Class<RCTComponentViewProtocol> NVNavigationStackCls(void)
{
  return NVNavigationStackComponentView.class;
}
#endif
