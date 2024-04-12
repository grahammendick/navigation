#import "NVSceneView.h"
#import <React/UIView+React.h>

@implementation NVSceneView
{
    BOOL _notifiedPeekable;
    NSMutableArray<NVTransition*> *_enterTransitions;
    NSMutableArray<NVTransition*> *_exitTransitions;
}

- (id)init
{
    if (self = [super init]) {
        _enterTransitions = [[NSMutableArray alloc] init];
        _exitTransitions = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)setEnterTrans:(NSDictionary *)enterTrans
{
    [_enterTransitions removeAllObjects];
    NSString *durationStr = enterTrans[@"duration"];
    int duration = [durationStr length] ? [durationStr intValue] : 350;
    for (int i = 0; i < ((NSArray<NSDictionary *> *) enterTrans[@"items"]).count; i++) {
        NSDictionary *transItem = ((NSArray<NSDictionary *> *) enterTrans[@"items"])[i];
        NVTransition *transition = [[NVTransition alloc] initWithType:transItem[@"type"]];
        NSString *defaultVal = @"0";
        if ([transition.type isEqualToString:@"scale"] || [transition.type isEqualToString:@"alpha"])
            defaultVal = @"1";
        durationStr = transItem[@"duration"];
        transition.duration = [durationStr length] ? [durationStr intValue] : duration;
        transition.x = [self parseAnimation:transItem[@"fromX"] defaultVal:defaultVal];
        transition.y = [self parseAnimation:transItem[@"fromY"] defaultVal:defaultVal];
        if ([transition.type isEqualToString:@"alpha"] || [transition.type isEqualToString:@"rotate"])
            transition.x = [self parseAnimation:transItem[@"from"] defaultVal:defaultVal];
        [_enterTransitions addObject:transition];
    }
    self.enterTransArray = _enterTransitions;
}

- (void)setExitTrans:(NSDictionary *)exitTrans
{
    [_exitTransitions removeAllObjects];
    NSString *durationStr = exitTrans[@"duration"];
    int duration = [durationStr length] ? [durationStr intValue] : 350;
    for (int i = 0; i < ((NSArray<NSDictionary *> *) exitTrans[@"items"]).count; i++) {
        NSDictionary *transItem = ((NSArray<NSDictionary *> *) exitTrans[@"items"])[i];
        NVTransition *transition = [[NVTransition alloc] initWithType:transItem[@"type"]];
        NSString *defaultVal = @"0";
        if ([transition.type isEqualToString:@"scale"] || [transition.type isEqualToString:@"alpha"])
            defaultVal = @"1";
        durationStr = transItem[@"duration"];
        transition.duration = [durationStr length] ? [durationStr intValue] : duration;
        transition.x = [self parseAnimation:transItem[@"toX"] defaultVal:defaultVal];
        transition.y = [self parseAnimation:transItem[@"toY"] defaultVal:defaultVal];
        if ([transition.type isEqualToString:@"alpha"] || [transition.type isEqualToString:@"rotate"])
            transition.x = [self parseAnimation:transItem[@"to"] defaultVal:defaultVal];
        [_exitTransitions addObject:transition];
    }
    self.exitTransArray = _exitTransitions;
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

-(void)didPop
{
    self.onPopped(nil);
}

- (void)didUpdateReactSubviews
{
    [super didUpdateReactSubviews];
    if (!_notifiedPeekable && self.subviews.count > 0) {
        _notifiedPeekable = YES;
        if (self.peekableDidChangeBlock) {
            self.peekableDidChangeBlock();
        }
    }
}

@end
