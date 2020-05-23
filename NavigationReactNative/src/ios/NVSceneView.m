#import "NVSceneView.h"

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

@end
