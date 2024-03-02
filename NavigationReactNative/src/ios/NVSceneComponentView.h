#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>
#import "NVSceneController.h"

NS_ASSUME_NONNULL_BEGIN

@interface NVSceneComponentView : RCTViewComponentView <NVScene>

@property (nonatomic, copy) void (^peekableDidChangeBlock)(void);
@property (nonatomic, copy) NSString *sceneKey;
@property (nonatomic, copy) NSNumber *crumb;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, assign) BOOL hidesTabBar;
@property (nonatomic, copy) NSArray<NVTransition*> *enterTrans;
@property (nonatomic, copy) NSArray<NVTransition*> *exitTrans;

@end

NS_ASSUME_NONNULL_END
#endif
