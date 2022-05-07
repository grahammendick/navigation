#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSegmentedTabComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface NVSegmentedTabComponentView () <RCTNVSegmentedTabViewProtocol>
@end

@implementation NVSegmentedTabComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVSegmentedTabProps>();
        _props = defaultProps;
        _segmentedControl = [[UISegmentedControl alloc] init];
        self.contentView = _segmentedControl;
    }
    return self;
}

- (void)updateProps:(const facebook::react::Props::Shared &)props oldProps:(const facebook::react::Props::Shared &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<NVSegmentedTabProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<NVSegmentedTabProps const>(props);
    if (oldViewProps.titles != newViewProps.titles) {
        NSInteger selectedIndex = _segmentedControl.selectedSegmentIndex;
        [_segmentedControl removeAllSegments];
        for (auto i = 0; i < newViewProps.titles.size(); i++) {
            NSString *title = [[NSString alloc] initWithUTF8String: newViewProps.titles[i].c_str()];
            [_segmentedControl insertSegmentWithTitle:title atIndex:_segmentedControl.numberOfSegments animated:NO];
        }
        _segmentedControl.selectedSegmentIndex = selectedIndex;
    }
    [super updateProps:props oldProps:oldProps];
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSegmentedTabComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSegmentedTabCls(void)
{
  return NVSegmentedTabComponentView.class;
}
#endif
