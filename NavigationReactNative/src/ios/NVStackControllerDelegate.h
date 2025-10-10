#import <UIKit/UIKit.h>

@interface NVStackControllerDelegate : NSObject <UINavigationControllerDelegate>

-(id)initWithDel: (id<UINavigationControllerDelegate>)del;

@end

@interface NVStackControllerTransitionDelegate : NVStackControllerDelegate

@end
