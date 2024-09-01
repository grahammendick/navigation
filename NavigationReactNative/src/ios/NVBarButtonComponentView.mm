#ifdef RCT_NEW_ARCH_ENABLED
#import "NVBarButtonComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>
#import <react/renderer/imagemanager/ImageResponseObserverCoordinator.h>
#import <NVBarButtonComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTFont.h>
#import <React/RCTImageResponseDelegate.h>
#import <React/RCTImageResponseObserverProxy.h>

using namespace facebook::react;

@interface NVBarButtonComponentView () <RCTNVBarButtonViewProtocol, RCTImageResponseDelegate>
@end

@implementation NVBarButtonComponentView {
    ImageResponseObserverCoordinator const *_imageCoordinator;
    RCTImageResponseObserverProxy _imageResponseObserverProxy;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVBarButtonProps>();
        _props = defaultProps;
        self.button = [[UIBarButtonItem alloc] init];
        self.button.style = UIBarButtonItemStylePlain;
        self.button.target = self;
        self.button.action = @selector(buttonPressed);
        _imageResponseObserverProxy = RCTImageResponseObserverProxy(self);
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
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
    UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
    NSNumber *size = !self.fontSize ? @(UIFont.labelFontSize) : self.fontSize;
    UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:self.fontWeight style:self.fontStyle variant:nil scaleMultiplier:1];
    NSMutableDictionary *attributes = [NSMutableDictionary new];
    if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
        attributes[NSFontAttributeName] = font;
    }
    UIColor *tintColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    if (tintColor) {
        attributes[NSForegroundColorAttributeName] = tintColor;
    }
    self.button.tintColor = tintColor;
    [self.button setTitleTextAttributes:attributes forState:UIControlStateNormal];
    [self.button setTitleTextAttributes:attributes forState:UIControlStateSelected];
    NSString *testID = [[NSString alloc] initWithUTF8String: newViewProps.testID.c_str()];
    if (self.button.accessibilityIdentifier != testID)
        self.button.accessibilityIdentifier = testID;
    NSString *systemItemVal = [[NSString alloc] initWithUTF8String: newViewProps.systemItem.c_str()];
    if (systemItemVal.length) {
        NSInteger systemItem = [self systemItem:systemItemVal];
        if (systemItem >= 0) {
            self.button = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:(UIBarButtonSystemItem) systemItem target:self action:@selector(buttonPressed)];
            self.button.accessibilityIdentifier = testID;
        }
    }
    NSString *uri = [[NSString alloc] initWithUTF8String:newViewProps.image.uri.c_str()];
    if (![uri length]) {
        _button.image = nil;
    }
    [super updateProps:props oldProps:oldProps];
}

-(NSInteger)systemItem:(NSString*)val
{
    if ([val isEqualToString:@"done"]) return UIBarButtonSystemItemDone;
    if ([val isEqualToString:@"cancel"]) return UIBarButtonSystemItemCancel;
    if ([val isEqualToString:@"edit"]) return UIBarButtonSystemItemEdit;
    if ([val isEqualToString:@"save"]) return UIBarButtonSystemItemSave;
    if ([val isEqualToString:@"add"]) return UIBarButtonSystemItemAdd;
    if ([val isEqualToString:@"flexible-space"]) return UIBarButtonSystemItemFlexibleSpace;
    if ([val isEqualToString:@"fixed-space"]) return UIBarButtonSystemItemFixedSpace;
    if ([val isEqualToString:@"compose"]) return UIBarButtonSystemItemCompose;
    if ([val isEqualToString:@"reply"]) return UIBarButtonSystemItemReply;
    if ([val isEqualToString:@"action"]) return UIBarButtonSystemItemAction;
    if ([val isEqualToString:@"organize"]) return UIBarButtonSystemItemOrganize;
    if ([val isEqualToString:@"bookmarks"]) return UIBarButtonSystemItemBookmarks;
    if ([val isEqualToString:@"search"]) return UIBarButtonSystemItemSearch;
    if ([val isEqualToString:@"refresh"]) return UIBarButtonSystemItemRefresh;
    if ([val isEqualToString:@"stop"]) return UIBarButtonSystemItemStop;
    if ([val isEqualToString:@"camera"]) return UIBarButtonSystemItemCamera;
    if ([val isEqualToString:@"trash"]) return UIBarButtonSystemItemTrash;
    if ([val isEqualToString:@"play"]) return UIBarButtonSystemItemPlay;
    if ([val isEqualToString:@"pause"]) return UIBarButtonSystemItemPause;
    if ([val isEqualToString:@"rewind"]) return UIBarButtonSystemItemRewind;
    if ([val isEqualToString:@"fast-forward"]) return UIBarButtonSystemItemFastForward;
    if ([val isEqualToString:@"undo"]) return UIBarButtonSystemItemUndo;
    if ([val isEqualToString:@"redo"]) return UIBarButtonSystemItemRedo;
    return -1;
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

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    self.button = [[UIBarButtonItem alloc] init];
    self.button.style = UIBarButtonItemStylePlain;
    self.button.target = self;
    self.button.action = @selector(buttonPressed);
    self.imageCoordinator = nullptr;
}

- (void)updateState:(const facebook::react::State::Shared &)state oldState:(const facebook::react::State::Shared &)oldState
{
    auto _state = std::static_pointer_cast<NVBarButtonShadowNode::ConcreteState const>(state);
    auto _oldState = std::static_pointer_cast<NVBarButtonShadowNode::ConcreteState const>(oldState);
    auto data = _state->getData();
    bool havePreviousData = _oldState != nullptr;
    if (!havePreviousData || data.getImageSource() != _oldState->getData().getImageSource()) {
        if (@available(iOS 13.0, *)) {
            UIImage *systemSymbol = [UIImage systemImageNamed:[[NSString alloc] initWithUTF8String:data.getImageSource().uri.c_str()]];
            if (systemSymbol) {
               _button.image = systemSymbol;
                return;
            }
        }
        auto getCoordinator = [](ImageRequest const *request) -> ImageResponseObserverCoordinator const * {
            if (request) {
                return &request->getObserverCoordinator();
            } else {
                return nullptr;
            }
        };
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
      if ([image isEqual:_button.image]) {
        return;
      }
      _button.image = image;
  }
}

- (void)didReceiveProgress:(float)progress fromObserver:(void const *)observer
{
}

- (void)didReceiveFailureFromObserver:(void const *)observer
{
}

- (void)didReceiveProgress:(float)progress loaded:(int64_t)loaded total:(int64_t)total fromObserver:(nonnull const void *)observer
{
}

- (void)didReceiveFailure:(nonnull NSError *)error fromObserver:(nonnull const void *)observer
{
}


#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self.button setCustomView:childComponentView];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    if (self.button.customView == childComponentView)
        [self.button setCustomView:nil];
}

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
