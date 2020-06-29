#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVSceneView : UIView

@property (nonatomic, copy) NSString *sceneKey;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, assign) BOOL hidesTabBar;
@property (nonatomic, copy) RCTDirectEventBlock onPopped;

-(void)didPop;

@end
