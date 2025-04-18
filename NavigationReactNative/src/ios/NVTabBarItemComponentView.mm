#ifdef RCT_NEW_ARCH_ENABLED
#import "NVTabBarItemComponentView.h"
#import "NVNavigationStackComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>
#import <react/utils/ManagedObjectWrapper.h>
#import <NVTabBarItemComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTImagePrimitivesConversions.h"
#import <React/RCTConversions.h>
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>

using namespace facebook::react;

@interface NVTabBarItemComponentView () <RCTNVTabBarItemViewProtocol>
@end

@implementation NVTabBarItemComponentView
{
    UIImage *_image;
    ImageSource _imageSource;
    RCTImageLoader *_imageLoader;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVTabBarItemProps>();
        _props = defaultProps;
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
    self.tab.badgeColor = RCTUIColorFromSharedColor(newViewProps.badgeColor);
    _imageSource = ImageSource{};
    _imageSource.uri = newViewProps.image.uri;
    _imageSource.scale = newViewProps.image.scale;
    _imageSource.size = {static_cast<double>(newViewProps.image.width), static_cast<double>(newViewProps.image.height)};
    if (![[[NSString alloc] initWithUTF8String:_imageSource.uri.c_str()] isEqual:[[NSString alloc] initWithUTF8String:oldViewProps.image.uri.c_str()]]
        || _imageSource.size.width != oldViewProps.image.width || _imageSource.size.height != oldViewProps.image.height
        || _imageSource.scale != oldViewProps.image.scale)
        [self loadImage];
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
    self.stackDidChangeBlock = nil;
    _tab = nil;
    _foucCounter = 0;
    _image = nil;
    _imageSource = {};
    _imageLoader = nil;
}

- (void)updateState:(const facebook::react::State::Shared &)state oldState:(const facebook::react::State::Shared &)oldState
{
    auto _state = std::static_pointer_cast<NVTabBarItemShadowNode::ConcreteState const>(state);
    auto _oldState = std::static_pointer_cast<NVTabBarItemShadowNode::ConcreteState const>(oldState);
    auto data = _state->getData();
    if (auto imgLoaderPtr = _state.get()->getData().getImageLoader().lock()) {
        _imageLoader = facebook::react::unwrapManagedObject(imgLoaderPtr);
        [self loadImage];
    }
}

- (void)loadImage
{
    NSString *uri = [[NSString alloc] initWithUTF8String:_imageSource.uri.c_str()];
    if ([uri length]) {
        if (@available(iOS 13.0, *)) {
            UIImage *sfSymbol = [UIImage systemImageNamed:[uri lastPathComponent]];
            if (sfSymbol) {
                _image = sfSymbol;
                _tab.image = sfSymbol;
                return;
            }
        }
        [_imageLoader loadImageWithURLRequest:NSURLRequestFromImageSource(_imageSource) size:CGSizeMake(_imageSource.size.width, _imageSource.size.height) scale:_imageSource.scale clipped:NO resizeMode:RCTResizeModeCover progressBlock:^(int64_t progress, int64_t total){} partialLoadBlock:^(UIImage *image){} completionBlock:^(NSError *error, UIImage *image) {
            dispatch_async(dispatch_get_main_queue(), ^{
                self->_image = image;
                self->_tab.image = image;
            });
        }];
    } else {
        if (_tab.image == _image)
            _tab.image = nil;
        _image = nil;
    }
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self ensureTabBarItem];
    [super mountChildComponentView:childComponentView index:index];
    if ([childComponentView class] == [NVNavigationStackComponentView class])
        self.navigationController = [(NVNavigationStackComponentView *) childComponentView navigationController];
    self.navigationController.tabBarItem = self.tab;
    if (self.stackDidChangeBlock) {
        self.stackDidChangeBlock(self);
    }
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
