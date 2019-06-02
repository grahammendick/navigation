#import "NVNavigationStackView.h"
#import "NVSceneView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVNavigationStackView
{
    UINavigationController *_navigationController;
    NSMutableArray *_scenes;
}

- (id)init
{
    if (self = [super init]) {
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
    NSInteger crumb = [self.reactSubviews indexOfObject:subview] - 1;
    [super removeReactSubview:subview];
    [_scenes removeObjectAtIndex:crumb];
}

- (void)didUpdateReactSubviews
{
    NSInteger crumb = [_scenes count] - 1;
    NSInteger currentCrumb = [_navigationController.viewControllers count] - 1;
    if (crumb < currentCrumb) {
        [_navigationController popToViewController:_navigationController.viewControllers[crumb] animated:true];
    }
    if (crumb > currentCrumb) {
        NSMutableArray *controllers = [[NSMutableArray alloc] init];
        for(NSInteger i = 0; i < crumb - currentCrumb; i++) {
            NSInteger nextCrumb = currentCrumb + i + 1;
            UIViewController *controller = [UIViewController new];
            NVSceneView *scene = (NVSceneView *) [_scenes objectAtIndex:nextCrumb];
            controller.view = scene;
            controller.title = scene.title;
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

- (void)layoutSubviews
{
    [super layoutSubviews];
    _navigationController.view.frame = self.bounds;
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSInteger crumb = [navigationController.viewControllers indexOfObject:viewController];
    if (crumb < [self.reactSubviews count] - 1) {
        self.onNavigateBackIOS(@{@"crumb": @(crumb)});
    }
}

@end
