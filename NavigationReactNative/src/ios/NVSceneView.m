#import "NVSceneView.h"

@implementation NVSceneView

- (id)init
{
    if (self = [super init]) {
    }
    return self;
}

-(void)willAppear
{
    self.onWillAppear(nil);
}

@end
