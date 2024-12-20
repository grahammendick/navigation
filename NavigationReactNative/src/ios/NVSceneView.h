#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>
#import "NVSceneController.h"
#import "NVSharedElementView.h"

@interface NVSceneView : UIView <NVScene>

@property (nonatomic, copy) NSString *sceneKey;
@property (nonatomic, copy) NSNumber *crumb;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, assign) BOOL hidesTabBar;
@property (nonatomic, assign) BOOL stacked;
@property (nonatomic, copy) NSArray<NVTransition*> *enterTransArray;
@property (nonatomic, copy) NSArray<NVTransition*> *exitTransArray;
@property (nonatomic, copy) RCTDirectEventBlock onPopped;

-(void)didPop;

@end
