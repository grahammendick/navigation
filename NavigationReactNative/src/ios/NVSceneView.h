#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVSceneView : UIView

@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) RCTDirectEventBlock onWillAppear;

-(void)willAppear;

@end
