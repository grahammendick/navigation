#import "NavigationModule.h"
#import "NVSceneController.h"

#import <UIKit/UIKit.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation NavigationModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"Navigate", @"PeekNavigate"];
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(render:(NSInteger)crumb tab:(NSInteger)tab titles:(NSArray *)titles appKey:(NSString *)appKey sharedElementNames:(NSArray *)sharedElementNames oldSharedElementNames:(NSArray *)oldSharedElementNames enterAnim:(NSString *)enterAnim exitAnim:(NSString *)exitAnim)
{
    UINavigationController *navigationController;
    UIViewController *rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    if ([rootViewController isKindOfClass:[UITabBarController class]]) {
        navigationController = (UINavigationController *)((UITabBarController *)rootViewController).viewControllers[tab];
    } else {
        navigationController = (UINavigationController *)rootViewController;
    }
    ((NVSceneController *) [navigationController viewControllers][0]).navigationModule = self;
    
    NSInteger currentCrumb = [navigationController.viewControllers count] - 1;
    if (crumb < currentCrumb) {
        [navigationController popToViewController:navigationController.viewControllers[crumb] animated:true];
    }
    if (crumb > currentCrumb) {
        NSMutableArray *controllers = [[NSMutableArray alloc] init];
        for(NSInteger i = 0; i < crumb - currentCrumb; i++) {
            NSInteger nextCrumb = currentCrumb + i + 1;
            UIViewController *controller = [[NVSceneController alloc] initWithModule: self crumb: nextCrumb tab: tab title: titles[nextCrumb] appKey: appKey];
            [controllers addObject:controller];
        }
        
        if (crumb - currentCrumb == 1) {
            [navigationController pushViewController:controllers[0] animated:true];
        } else {
            NSArray *allControllers = [navigationController.viewControllers arrayByAddingObjectsFromArray:controllers];
            [navigationController setViewControllers:allControllers animated:true];
        }
    }
    for (NVSceneController *controller in [navigationController viewControllers]) {
        controller.title = titles[controller.crumb];
    }
    if ([rootViewController isKindOfClass:[UITabBarController class]]) {
        ((UITabBarController *)rootViewController).selectedViewController = navigationController;
    }
}

@end
