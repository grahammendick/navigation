#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabBarItemComponentView.h"
#import "NVNavigationStackComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTFont.h>

using namespace facebook::react;

@interface NVTabBarItemComponentView () <RCTNVTabBarItemViewProtocol>
@end

@implementation NVTabBarItemComponentView
{
    NSString *_oldSystemItemVal;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVTabBarItemProps>();
        _props = defaultProps;
        self.tab = [[UITabBarItem alloc] init];
        _oldSystemItemVal = @"";
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<NVTabBarItemProps const>(props);
    NSString *systemItemVal = [[NSString alloc] initWithUTF8String: newViewProps.systemItem.c_str()];
    if (![_oldSystemItemVal isEqualToString:systemItemVal]) {
        if (systemItemVal.length) {
            NSInteger systemItem = [self systemItem:systemItemVal];
            if (systemItem != -1) {
                self.tab = [[UITabBarItem alloc] initWithTabBarSystemItem:(UITabBarSystemItem) systemItem tag:0];
            }
        }
        else {
           self.tab = [[UITabBarItem alloc] init];
        }
        self.navigationController.tabBarItem = self.tab;
        _oldSystemItemVal = systemItemVal;
    }
    NSString *title = [[NSString alloc] initWithUTF8String: newViewProps.title.c_str()];
    _fontFamily = [[NSString alloc] initWithUTF8String: newViewProps.fontFamily.c_str()];
    _fontFamily = _fontFamily.length ? _fontFamily : nil;
    _fontWeight = [[NSString alloc] initWithUTF8String: newViewProps.fontWeight.c_str()];
    _fontWeight = _fontWeight.length ? _fontWeight : nil;
    _fontStyle = [[NSString alloc] initWithUTF8String: newViewProps.fontStyle.c_str()];
    _fontStyle = _fontStyle.length ? _fontStyle : nil;
    _fontSize = @(newViewProps.fontSize);
    _fontSize = [_fontSize intValue] >= 0 ? _fontSize : nil;
    if (self.tab.title != title)
        self.tab.title = title;
    NSString *testID = [[NSString alloc] initWithUTF8String: newViewProps.testID.c_str()];
    if (self.tab.accessibilityIdentifier != testID)
        self.tab.accessibilityIdentifier = testID;
    UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
    NSNumber *size = !self.fontSize ? @10 : self.fontSize;
    NSString *weight = !self.fontWeight ? @"500" : self.fontWeight;
    UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:weight style:self.fontStyle variant:nil scaleMultiplier:1];
    NSMutableDictionary *attributes = [NSMutableDictionary new];
    if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
        attributes[NSFontAttributeName] = font;
    }
    [self.tab setTitleTextAttributes:attributes forState:UIControlStateNormal];
    NSString *badge = [[NSString alloc] initWithUTF8String: newViewProps.badge.c_str()];
    if (self.tab.badgeValue != badge)
        self.tab.badgeValue = !!badge.length ? badge : nil;
    UIColor *badgeColor = RCTUIColorFromSharedColor(newViewProps.badgeColor);
    if (self.tab.badgeColor != badgeColor)
        self.tab.badgeColor = UIColor.greenColor;
    [super updateProps:props oldProps:oldProps];
}

-(NSInteger)systemItem:(NSString*)val
{
    if ([val isEqualToString:@"more"]) return UITabBarSystemItemMore;
    if ([val isEqualToString:@"favorites"]) return UITabBarSystemItemFavorites;
    if ([val isEqualToString:@"featured"]) return UITabBarSystemItemFeatured;
    if ([val isEqualToString:@"top-rated"]) return UITabBarSystemItemTopRated;
    if ([val isEqualToString:@"recents"]) return UITabBarSystemItemRecents;
    if ([val isEqualToString:@"contacts"]) return UITabBarSystemItemContacts;
    if ([val isEqualToString:@"history"]) return UITabBarSystemItemHistory;
    if ([val isEqualToString:@"bookmarks"]) return UITabBarSystemItemBookmarks;
    if ([val isEqualToString:@"search"]) return UITabBarSystemItemSearch;
    if ([val isEqualToString:@"downloads"]) return UITabBarSystemItemDownloads;
    if ([val isEqualToString:@"most-recent"]) return UITabBarSystemItemMostRecent;
    if ([val isEqualToString:@"most-viewed"]) return UITabBarSystemItemMostViewed;
    return -1;
}

- (void)onPress
{
    std::static_pointer_cast<NVTabBarItemEventEmitter const>(_eventEmitter)
        ->onPress(NVTabBarItemEventEmitter::OnPress{});
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _oldSystemItemVal = @"";
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    if ([childComponentView class] == [NVNavigationStackComponentView class])
        self.navigationController = [(NVNavigationStackComponentView *) childComponentView navigationController];
    self.navigationController.tabBarItem = self.tab;
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVTabBarItemComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVTabBarItemCls(void)
{
  return NVTabBarItemComponentView.class;
}
#endif
