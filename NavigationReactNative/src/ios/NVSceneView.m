#import "NVSceneView.h"
#import <React/UIView+React.h>

@implementation NVSceneView

- (id)init
{
    if (self = [super init]) {
    }
    return self;
}

-(void)didPop
{
    self.onPopped(nil);
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [super didSetProps:changedProps];
    if ([changedProps containsObject:@"fluent"]) {
        if (self.fluentDidChangeBlock) {
            self.fluentDidChangeBlock();
        }
    }
}


@end
