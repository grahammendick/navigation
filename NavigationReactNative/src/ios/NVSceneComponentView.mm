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
    _sceneKey = [NSString  stringWithUTF8String: newViewProps.sceneKey.c_str()];
    _crumb = [NSNumber numberWithInt:newViewProps.crumb];
    _title = [NSString  stringWithUTF8String: newViewProps.title.c_str()];
    _hidesTabBar = newViewProps.hidesTabBar;
    [_enterTransitions removeAllObjects];
    [_exitTransitions removeAllObjects];
    NSString *durationStr = [NSString  stringWithUTF8String: newViewProps.enterTrans.duration.c_str()];
    int duration = [durationStr length] ? [durationStr intValue] : 350;
    for (auto i = 0; i < newViewProps.enterTrans.items.size(); i++) {
        NVSceneEnterTransItemsStruct transItem = newViewProps.enterTrans.items[i];
        NVTransition *transition = [[NVTransition alloc] initWithType:[NSString  stringWithUTF8String: transItem.type.c_str()]];
        NSString *defaultVal = @"0";
        if ([transition.type isEqualToString:@"scale"] || [transition.type isEqualToString:@"alpha"])
            defaultVal = @"1";
        durationStr = [NSString  stringWithUTF8String: transItem.duration.c_str()];
        transition.duration = [durationStr length] ? [durationStr intValue] : duration;
        transition.x = [self parseAnimation:[NSString  stringWithUTF8String: transItem.fromX.c_str()] defaultVal:defaultVal];
        transition.y = [self parseAnimation:[NSString  stringWithUTF8String: transItem.fromY.c_str()] defaultVal:defaultVal];
        if ([transition.type isEqualToString:@"alpha"] || [transition.type isEqualToString:@"rotate"])
            transition.x = [self parseAnimation:[NSString  stringWithUTF8String: transItem.from.c_str()] defaultVal:defaultVal];
        [_enterTransitions addObject:transition];
    }
    durationStr = [NSString  stringWithUTF8String: newViewProps.enterTrans.duration.c_str()];
    duration = [durationStr length] ? [durationStr intValue] : 350;
    for (auto i = 0; i < newViewProps.exitTrans.items.size(); i++) {
        NVSceneExitTransItemsStruct transItem = newViewProps.exitTrans.items[i];
        NVTransition *transition = [[NVTransition alloc] initWithType:[NSString  stringWithUTF8String: transItem.type.c_str()]];
        NSString *defaultVal = @"0";
        if ([transition.type isEqualToString:@"scale"] || [transition.type isEqualToString:@"alpha"])
            defaultVal = @"1";
        durationStr = [NSString  stringWithUTF8String: transItem.duration.c_str()];
        transition.duration = [durationStr length] ? [durationStr intValue] : duration;
        transition.x = [self parseAnimation:[NSString  stringWithUTF8String: transItem.toX.c_str()] defaultVal:defaultVal];
        transition.y = [self parseAnimation:[NSString  stringWithUTF8String: transItem.toY.c_str()] defaultVal:defaultVal];
        if ([transition.type isEqualToString:@"alpha"] || [transition.type isEqualToString:@"rotate"])
            transition.x = [self parseAnimation:[NSString  stringWithUTF8String: transItem.to.c_str()] defaultVal:defaultVal];
        [_exitTransitions addObject:transition];
    }
    self.enterTrans = _enterTransitions;
    self.exitTrans = _exitTransitions;
    dispatch_async(dispatch_get_main_queue(), ^{
        [self didUpdate];
    });
    [super updateProps:props oldProps:oldProps];
}

- (NVTransitionValue)parseAnimation:(NSString *)val defaultVal:(NSString *)defaultVal
{
    NVTransitionValue transitionValue;
    val = [val length] ? val : defaultVal;
    if ([val hasSuffix:@"%"]) {
        transitionValue.val = [[val substringToIndex:[val length] -1] floatValue];
        transitionValue.percent = YES;
    } else {
        transitionValue.val = [val floatValue];
        transitionValue.percent = NO;
    }
    return transitionValue;
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
