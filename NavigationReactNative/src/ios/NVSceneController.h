#import "NavigationModule.h"

#import <UIKit/UIKit.h>

@interface NVSceneController : UIViewController

@property NSInteger crumb;
@property NSInteger tab;
@property NSString *appKey;
@property NavigationModule *navigationModule;

-(id)init: (NSInteger)crumb tab:(NSInteger)tab title:(NSString *)title appKey:(NSString *)appKey navigationModule: (NavigationModule *)navigationModule;

@end
