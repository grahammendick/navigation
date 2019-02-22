#import "NavigationModule.h"
#import "NVSceneController.h"

#import <UIKit/UIKit.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation NavigationModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"Navigate", @"WillNavigate"];
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
    
    NSInteger currentCrumb = [navigationController.viewControllers count] - 1;
    if (crumb < currentCrumb) {
        [navigationController popToViewController:navigationController.viewControllers[crumb] animated:true];
    }
    if (crumb > currentCrumb) {
        NSMutableArray *controllers = [navigationController.viewControllers mutableCopy];
        for(NSInteger i = 0; i < crumb - currentCrumb; i++) {
            NSInteger nextCrumb = currentCrumb + i + 1;
            UIViewController *controller = [[NVSceneController alloc] initWithModule: self crumb: nextCrumb tab: tab title: titles[nextCrumb] appKey: appKey];
            [controllers addObject:controller];
        }
        [navigationController setViewControllers:controllers animated:true];
    }
    navigationController.viewControllers[crumb].title = titles[crumb];
    if ([rootViewController isKindOfClass:[UITabBarController class]]) {
        ((UITabBarController *)rootViewController).selectedViewController = navigationController;
    }
}

@end
