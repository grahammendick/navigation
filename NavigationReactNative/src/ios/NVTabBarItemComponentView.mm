#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabBarItemComponentView.h"
#import "NVNavigationStackComponentView.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>
#import <react/renderer/imagemanager/ImageResponseObserverCoordinator.h>
#import <navigation-react-native/NVTabBarItemComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTFont.h>
#import <React/RCTImageResponseDelegate.h>
#import <React/RCTImageResponseObserverProxy.h>

using namespace facebook::react;

@interface NVTabBarItemComponentView () <RCTNVTabBarItemViewProtocol, RCTImageResponseDelegate>
@end

@implementation NVTabBarItemComponentView
{
    UIImage *_image;
    ImageResponseObserverCoordinator const *_imageCoordinator;
    RCTImageResponseObserverProxy _imageResponseObserverProxy;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVTabBarItemProps>();
        _props = defaultProps;
        _imageResponseObserverProxy = RCTImageResponseObserverProxy(self);
    }
    return self;
}

- (void)ensureTabBarItem
{
    if (!_tab) {
        self.tab = [[UITabBarItem alloc] init];
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self ensureTabBarItem];
    const auto &oldViewProps = *std::static_pointer_cast<NVTabBarItemProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<NVTabBarItemProps const>(props);
    if (oldViewProps.systemItem != newViewProps.systemItem) {
        NSString *systemItemVal = [[NSString alloc] initWithUTF8String: newViewProps.systemItem.c_str()];
        if (systemItemVal.length) {
            NSInteger systemItem = [self systemItem:systemItemVal];
            if (systemItem != -1) {
                self.tab = [[UITabBarItem alloc] initWithTabBarSystemItem:(UITabBarSystemItem) systemItem tag:0];
            }
        }
        else {
            self.tab = [[UITabBarItem alloc] init];
            self.tab.image = _image;
        }
        self.navigationController.tabBarItem = self.tab;
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
    NSString *uri = [[NSString alloc] initWithUTF8String:newViewProps.image.uri.c_str()];
    if (![uri length]) {
        _image = nil;
        _tab.image = nil;
    }
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
    _navigationController.tabBarItem = nil;
    _navigationController = nil;
    self.imageCoordinator = nullptr;
    _tab = nil;
    _image = nil;
}

- (void)updateState:(const facebook::react::State::Shared &)state oldState:(const facebook::react::State::Shared &)oldState
{
  auto _state = std::static_pointer_cast<NVTabBarItemShadowNode::ConcreteState const>(state);
  auto _oldState = std::static_pointer_cast<NVTabBarItemShadowNode::ConcreteState const>(oldState);
  auto data = _state->getData();
  bool havePreviousData = _oldState != nullptr;
  auto getCoordinator = [](ImageRequest const *request) -> ImageResponseObserverCoordinator const * {
    if (request) {
      return &request->getObserverCoordinator();
    } else {
      return nullptr;
    }
  };
  if (!havePreviousData || data.getImageSource() != _oldState->getData().getImageSource()) {
    self.imageCoordinator = getCoordinator(&data.getImageRequest());
  }
}

- (void)setImageCoordinator:(const ImageResponseObserverCoordinator *)coordinator
{
  if (_imageCoordinator) {
    _imageCoordinator->removeObserver(_imageResponseObserverProxy);
  }
  _imageCoordinator = coordinator;
  if (_imageCoordinator) {
    _imageCoordinator->addObserver(_imageResponseObserverProxy);
  }
}

#pragma mark - RCTImageResponseDelegate

- (void)didReceiveImage:(UIImage *)image metadata:(id)metadata fromObserver:(void const *)observer
{
  if (observer == &_imageResponseObserverProxy) {
      if ([image isEqual:_tab.image]) {
        return;
      }
      _image = image;
      _tab.image = image;
  }
}

- (void)didReceiveProgress:(float)progress fromObserver:(void const *)observer
{
}

- (void)didReceiveFailureFromObserver:(void const *)observer
{
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self ensureTabBarItem];
    [super mountChildComponentView:childComponentView index:index];
    if ([childComponentView class] == [NVNavigationStackComponentView class])
        self.navigationController = [(NVNavigationStackComponentView *) childComponentView navigationController];
    self.navigationController.tabBarItem = self.tab;
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [super unmountChildComponentView:childComponentView index:index];
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
