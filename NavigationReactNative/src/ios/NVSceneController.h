#import <UIKit/UIKit.h>

@interface NVSceneController : UIViewController

@property NSInteger crumb;
@property NSInteger tab;
@property NSString *appKey;

-(id)init: (NSInteger)crumb tab:(NSInteger)tab title:(NSString *)title appKey:(NSString *)appKey;

@end
