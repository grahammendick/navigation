#import "NVNavigationStackView.h"
#import "NVSceneView.h"
#import "NVSceneController.h"

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>

@implementation NVNavigationStackView
{
    __weak RCTBridge *_bridge;
    NSMutableArray *_scenes;
    NSInteger _nativeEventCount;
}

- (id)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super init]) {
        _bridge = bridge;
        _navigationController = [[UINavigationController alloc] init];
        [self addSubview:_navigationController.view];
        _navigationController.delegate = self;
        _scenes = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:[UIView new] atIndex:atIndex];
    [_scenes insertObject:subview atIndex:atIndex];
}

- (void)removeReactSubview:(UIView *)subview
{
    NSInteger crumb = [self.reactSubviews indexOfObject:subview];
    [super removeReactSubview:subview];
    [_scenes removeObjectAtIndex:crumb];
}

- (void)didUpdateReactSubviews
{
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag != 0)
        return;
    NSInteger crumb = [_scenes count] - 1;
    NSInteger currentCrumb = [_navigationController.viewControllers count] - 1;
    if (crumb < currentCrumb) {
        [_navigationController popToViewController:_navigationController.viewControllers[crumb] animated:true];
    }
    if (crumb > currentCrumb) {
        NSMutableArray *controllers = [[NSMutableArray alloc] init];
        for(NSInteger i = 0; i < crumb - currentCrumb; i++) {
            NSInteger nextCrumb = currentCrumb + i + 1;
            NVSceneView *scene = (NVSceneView *) [_scenes objectAtIndex:nextCrumb];
            if (!![scene superview])
                return;
            NVSceneController *controller = [[NVSceneController alloc] initWithScene:scene];
            __weak typeof(self) weakSelf = self;
            controller.boundsDidChangeBlock = ^(NVSceneController *sceneController) {
                [weakSelf notifyForBoundsChange:sceneController];
            };
            controller.navigationItem.title = scene.title;
            [controllers addObject:controller];
        }
        
        if (crumb - currentCrumb == 1) {
            [_navigationController pushViewController:controllers[0] animated:true];
        } else {
            NSArray *allControllers = [_navigationController.viewControllers arrayByAddingObjectsFromArray:controllers];
            [_navigationController setViewControllers:allControllers animated:true];
        }
    }
}

- (void)notifyForBoundsChange:(NVSceneController *)controller
{
    [_bridge.uiManager setSize:controller.view.bounds.size forView:controller.view];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _navigationController.view.frame = self.bounds;
}

- (void)dealloc
{
    _navigationController.delegate = nil;
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSInteger crumb = [navigationController.viewControllers indexOfObject:viewController];
    if (crumb < [self.reactSubviews count] - 1) {
        _nativeEventCount++;
        self.onDidNavigateBack(@{
            @"crumb": @(crumb),
            @"eventCount": @(_nativeEventCount),
        });
    }
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSInteger crumb = [navigationController.viewControllers indexOfObject:viewController];
    NVSceneView *scene = (NVSceneView *) [_scenes objectAtIndex:crumb];
    [scene willAppear];
}

@end
