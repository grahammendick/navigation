#import <UIKit/UIKit.h>

@interface NVStackControllerDelegate : NSObject <UINavigationControllerDelegate>

-(id)initWithStackView: (id<UINavigationControllerDelegate>)stackView;

@end

@interface NVStackControllerTransitionDelegate : NVStackControllerDelegate

@end
