#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSceneComponentView.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVSceneComponentView () <RCTNVSceneViewProtocol>
@end

@implementation NVSceneComponentView
{
    BOOL _notifiedPeekable;
    UIViewController *_oldViewController;
    NSMutableArray<NVTransition*> *_enterTransitions;
    NSMutableArray<NVTransition*> *_exitTransitions;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVSceneProps>();
        _props = defaultProps;
        _enterTransitions = [[NSMutableArray alloc] init];
        _exitTransitions = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)ensureViewController
{
    if (!!_oldViewController) {
        [_oldViewController willMoveToParentViewController:nil];
        [_oldViewController.view removeFromSuperview];
        [_oldViewController removeFromParentViewController];
        _oldViewController.view = nil;
        _oldViewController = nil;
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self ensureViewController];
    const auto &newViewProps = *std::static_pointer_cast<NVSceneProps const>(props);
    _sceneKey = [[NSString alloc] initWithUTF8String: newViewProps.sceneKey.c_str()];
    _crumb = [NSNumber numberWithInt:newViewProps.crumb];
    _title = [[NSString alloc] initWithUTF8String: newViewProps.title.c_str()];
    _hidesTabBar = newViewProps.hidesTabBar;
    [_enterTransitions removeAllObjects];
    [_exitTransitions removeAllObjects];
    for (auto i = 0; i < newViewProps.enterTrans.items.size(); i++) {
        NVSceneEnterTransItemsStruct transItem = newViewProps.enterTrans.items[i];
        NVTransition *transition = [[NVTransition alloc] init];
        transition.type = [[NSString alloc] initWithUTF8String: transItem.type.c_str()];
        [_enterTransitions addObject:transition];
    }
    for (auto i = 0; i < newViewProps.exitTrans.items.size(); i++) {
        NVSceneExitTransItemsStruct transItem = newViewProps.exitTrans.items[i];
        NVTransition *transition = [[NVTransition alloc] init];
        transition.type = [[NSString alloc] initWithUTF8String: transItem.type.c_str()];
        [_exitTransitions addObject:transition];
    }
    self.enterTrans = _enterTransitions;
    self.exitTrans = _exitTransitions;
    dispatch_async(dispatch_get_main_queue(), ^{
        [self didUpdate];
    });
    [super updateProps:props oldProps:oldProps];
}

- (void)didPop
{
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVSceneEventEmitter const>(_eventEmitter)
            ->onPopped(NVSceneEventEmitter::OnPopped{});
    }
}

- (void)didUpdate
{
    if (!_notifiedPeekable && self.subviews.count > 0) {
        _notifiedPeekable = YES;
        if (self.peekableDidChangeBlock) {
            self.peekableDidChangeBlock();
        }
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _oldViewController = self.reactViewController;
    _notifiedPeekable = NO;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSceneComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSceneCls(void)
{
  return NVSceneComponentView.class;
}
#endif
