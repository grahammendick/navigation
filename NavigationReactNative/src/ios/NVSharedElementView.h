#ifndef RCT_REMOVE_LEGACY_ARCH
#import "NVBarView.h"
#import "NVSceneController.h"

#import <UIKit/UIKit.h>

@interface NVSharedElementView : UIView <NVSharedElement>

@property (nonatomic, copy) NSString *name;

@end

#endif

