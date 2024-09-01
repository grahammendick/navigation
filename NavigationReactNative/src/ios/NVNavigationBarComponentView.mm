#ifdef RCT_NEW_ARCH_ENABLED
#import "NVNavigationBarComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>
#import <react/renderer/imagemanager/ImageResponseObserverCoordinator.h>
#import <NVNavigationBarComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTFont.h>
#import <React/RCTImageResponseDelegate.h>
#import <React/RCTImageResponseObserverProxy.h>
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVNavigationBarComponentView () <RCTNVNavigationBarViewProtocol, RCTImageResponseDelegate>
@end

@implementation NVNavigationBarComponentView {
    ImageResponseObserverCoordinator const *_imageCoordinator;
    RCTImageResponseObserverProxy _imageResponseObserverProxy;
    UIImage *_backImage;
    BOOL addedListener;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVNavigationBarProps>();
        _props = defaultProps;
        _imageResponseObserverProxy = RCTImageResponseObserverProxy(self);
    }
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<NVNavigationBarProps const>(props);
    _crumb = [NSNumber numberWithInt:newViewProps.crumb];
    if (!addedListener) {
        addedListener = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(receiveFind:) name:[@"findNavigationBar" stringByAppendingString: [_crumb stringValue]] object:nil];
    }
    _isHidden = newViewProps.isHidden;
    if (self.reactViewController == self.reactViewController.navigationController.topViewController) {
        [self.reactViewController.navigationController setNavigationBarHidden:self.isHidden];
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
    _shadowColor = RCTUIColorFromSharedColor(newViewProps.shadowColor);
    _backTitle = [[NSString alloc] initWithUTF8String: newViewProps.backTitle.c_str()];
    _backTitle = newViewProps.backTitleOn ? _backTitle : nil;
    UINavigationItem *previousNavigationItem = [self previousNavigationItem];
    if (previousNavigationItem.backBarButtonItem.title != _backTitle) {
        previousNavigationItem.backBarButtonItem = nil;
        if (self.backTitle != nil) {
            previousNavigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:self.backTitle style:UIBarButtonItemStylePlain target:nil action:nil];
        }
    }
    _backTestID = [[NSString alloc] initWithUTF8String: newViewProps.backTestID.c_str()];
    NSString *uri = [[NSString alloc] initWithUTF8String:newViewProps.backImage.uri.c_str()];
    _backImageLoading = !![uri length];
    if (![uri length]) {
        _backImage = nil;
    }
    [self updateStyle];
    [super updateProps:props oldProps:oldProps];
}

- (void) receiveFind:(NSNotification *) notification
{
    NVFindNavigationBarNotification *findNavigationBarNotification = (NVFindNavigationBarNotification *) notification.object;
    UIView *ancestor = self;
    while(ancestor) {
        if (ancestor == findNavigationBarNotification.scene)
            findNavigationBarNotification.navigationBar = self;
        ancestor = ancestor.superview;
    }
}

- (void)updateStyle
{
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
    for (UIView *view in [navigationBar subviews]) {
        if ([view isKindOfClass:NSClassFromString(@"_UINavigationBarContentView")]) {
            for (UIView *child in [view subviews]) {
                if ([child isKindOfClass:NSClassFromString(@"_UIButtonBarButton")]) {
                    child.accessibilityIdentifier = self.backTestID;
                }
            }
        }
    }
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
    if (self.shadowColor) {
        [appearance setShadowColor:self.shadowColor];
    }
    [appearance setBackgroundColor:color];
    [appearance.buttonAppearance.normal setTitleTextAttributes:attributes];
    [appearance.doneButtonAppearance.normal setTitleTextAttributes:attributes];
    [appearance setTitleTextAttributes:[self titleAttributes]];
    [appearance setLargeTitleTextAttributes:[self largeTitleAttributes]];
    appearance.backButtonAppearance = [UIBarButtonItemAppearance new];
    appearance.backButtonAppearance.normal.titleTextAttributes = [self backAttributes];
    [appearance setBackIndicatorImage:_backImage transitionMaskImage:_backImage];
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

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    self.imageCoordinator = nullptr;
    _backImageLoading = NO;
    _backImage = nil;
    addedListener = NO;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)updateState:(const facebook::react::State::Shared &)state oldState:(const facebook::react::State::Shared &)oldState
{
  auto _state = std::static_pointer_cast<NVNavigationBarShadowNode::ConcreteState const>(state);
  auto _oldState = std::static_pointer_cast<NVNavigationBarShadowNode::ConcreteState const>(oldState);
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
      if ([image isEqual:_backImage]) {
        return;
      }
      if (self.backImageDidLoadBlock) {
          self.backImageDidLoadBlock();
          self.backImageDidLoadBlock = nil;
      }
      _backImageLoading = NO;
      _backImage = image;
      [self updateStyle];
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
    [self addSubview:childComponentView];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [childComponentView removeFromSuperview];
}

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
