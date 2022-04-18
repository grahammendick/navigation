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
