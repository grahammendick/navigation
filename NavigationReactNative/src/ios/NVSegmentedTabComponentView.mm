#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSegmentedTabComponentView.h"
#import "NVTabBarPagerComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTFont.h>

using namespace facebook::react;

@interface NVSegmentedTabComponentView () <RCTNVSegmentedTabViewProtocol>
@end

@implementation NVSegmentedTabComponentView
{
    NSArray<NSString *> *_testIDs;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVSegmentedTabProps>();
        _props = defaultProps;
        _segmentedControl = [[UISegmentedControl alloc] init];
        [_segmentedControl addTarget:self action:@selector(tabPressed) forControlEvents:UIControlEventValueChanged];
        self.contentView = _segmentedControl;
    }
    return self;
}

- (void)updateProps:(const facebook::react::Props::Shared &)props oldProps:(const facebook::react::Props::Shared &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<NVSegmentedTabProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<NVSegmentedTabProps const>(props);
    _segmentedControl.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
    if (oldViewProps.titles != newViewProps.titles) {
        NSInteger selectedIndex = _segmentedControl.selectedSegmentIndex;
        [_segmentedControl removeAllSegments];
        for (auto i = 0; i < newViewProps.titles.size(); i++) {
            NSString *title = [[NSString alloc] initWithUTF8String: newViewProps.titles[i].c_str()];
            [_segmentedControl insertSegmentWithTitle:title atIndex:_segmentedControl.numberOfSegments animated:NO];
        }
        _segmentedControl.selectedSegmentIndex = selectedIndex;
    }
    _fontFamily = [[NSString alloc] initWithUTF8String: newViewProps.fontFamily.c_str()];
    _fontFamily = _fontFamily.length ? _fontFamily : nil;
    _fontWeight = [[NSString alloc] initWithUTF8String: newViewProps.fontWeight.c_str()];
    _fontWeight = _fontWeight.length ? _fontWeight : nil;
    _fontStyle = [[NSString alloc] initWithUTF8String: newViewProps.fontStyle.c_str()];
    _fontStyle = _fontStyle.length ? _fontStyle : nil;
    _fontSize = @(newViewProps.fontSize);
    _fontSize = [_fontSize intValue] >= 0 ? _fontSize : nil;
    UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
    NSNumber *size = !self.fontSize ? @13 : self.fontSize;
    UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:self.fontWeight style:self.fontStyle variant:nil scaleMultiplier:1];
    NSMutableDictionary *attributes = [NSMutableDictionary new];
    if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
        attributes[NSFontAttributeName] = font;
    }
    if (@available(iOS 13.0, *)) {
        _unselectedTintColor = RCTUIColorFromSharedColor(newViewProps.unselectedTintColor);
        if (_unselectedTintColor != nil) {
            attributes[NSForegroundColorAttributeName] = _unselectedTintColor;
        }
    }
    [_segmentedControl setTitleTextAttributes:attributes forState:UIControlStateNormal];
    UIColor *backgroundColor = RCTUIColorFromSharedColor(newViewProps.backgroundColor);
    [_segmentedControl setTintColor:backgroundColor];
    if (@available(iOS 13.0, *)) {
        [_segmentedControl setBackgroundColor:backgroundColor];
    }
    if (@available(iOS 13.0, *)) {
        NSMutableDictionary *attributes = [NSMutableDictionary new];
        UIColor *selectedTintColor = RCTUIColorFromSharedColor(newViewProps.selectedTintColor);
        if (selectedTintColor != nil) {
            attributes[NSForegroundColorAttributeName] = selectedTintColor;
        }
        [_segmentedControl setTitleTextAttributes:attributes forState:UIControlStateSelected];
    }
    NSMutableArray<NSString *> *testIDArr = [[NSMutableArray alloc] init];
    for (auto i = 0; i < newViewProps.testIDs.size(); i++) {
        NSString *key = [[NSString alloc] initWithUTF8String: newViewProps.testIDs[i].c_str()];
        [testIDArr addObject:key];
    }
    _testIDs = [testIDArr copy];
    [super updateProps:props oldProps:oldProps];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    for (int i = 0; i < self.accessibilityElements.count; i++) {
        UIView *segment = ((UIView *) self.accessibilityElements[i]);
        segment.subviews[0].accessibilityIdentifier = _testIDs[i];
    }
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    NVTabBarPagerComponentView *tabBarPager = [self getTabBarPager];
    if (!!tabBarPager)
        _segmentedControl.selectedSegmentIndex = tabBarPager.selectedTab;
}

- (NVTabBarPagerComponentView *)getTabBarPager
{
    for(NSInteger i = 0; i < [self.superview subviews].count; i++) {
        UIView *view = [self.superview subviews][i];
        if ([view isKindOfClass:[NVTabBarPagerComponentView class]])
            return (NVTabBarPagerComponentView *) view;
    }
    return nil;
}

- (void)tabPressed
{
    [[self getTabBarPager] setCurrentTab:_segmentedControl.selectedSegmentIndex];
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
