#ifdef RCT_NEW_ARCH_ENABLED
#import "NVBarButtonComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>
#import <react/utils/ManagedObjectWrapper.h>
#import <NVBarButtonComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTImagePrimitivesConversions.h"
#import <React/RCTConversions.h>
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>

using namespace facebook::react;

@interface NVBarButtonComponentView () <RCTNVBarButtonViewProtocol>
@end

@implementation NVBarButtonComponentView {
    ImageSource _imageSource;
    RCTImageLoader *_imageLoader;
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
    UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
    NSNumber *size = !self.fontSize ? @(UIFont.labelFontSize) : self.fontSize;
    UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:self.fontWeight style:self.fontStyle variant:nil scaleMultiplier:1];
    NSMutableDictionary *attributes = [NSMutableDictionary new];
    if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
        attributes[NSFontAttributeName] = font;
    }
    _name = [[NSString alloc] initWithUTF8String: newViewProps.sharedElement.c_str()];
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
    _imageSource = {};
    _imageLoader = nil;
}

- (void)updateState:(const facebook::react::State::Shared &)state oldState:(const facebook::react::State::Shared &)oldState
{
    auto _state = std::static_pointer_cast<NVBarButtonShadowNode::ConcreteState const>(state);
    auto _oldState = std::static_pointer_cast<NVBarButtonShadowNode::ConcreteState const>(oldState);
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
                _button.image = sfSymbol;
                return;
            }
        }
        [_imageLoader loadImageWithURLRequest:NSURLRequestFromImageSource(_imageSource) size:CGSizeMake(_imageSource.size.width, _imageSource.size.height) scale:_imageSource.scale clipped:NO resizeMode:RCTResizeModeCover progressBlock:^(int64_t progress, int64_t total){} partialLoadBlock:^(UIImage *image){} completionBlock:^(NSError *error, UIImage *image) {
            dispatch_async(dispatch_get_main_queue(), ^{
                self->_button.image = image;
            });
        }];
    } else {
        _button.image = nil;
    }
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
