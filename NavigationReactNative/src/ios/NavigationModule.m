#import "NavigationModule.h"
#import "NVSceneController.h"

#import <UIKit/UIKit.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation NavigationModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"Navigate"];
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSInteger crumb = ((NVSceneController *)viewController).crumb;
    NSInteger tab = ((NVSceneController *)viewController).tab;
    [self sendEventWithName:@"Navigate" body:@{@"crumb": @(crumb), @"tab": @(tab)}];
}

RCT_EXPORT_METHOD(render:(NSInteger)crumb tab:(NSInteger)tab titles:(NSArray *)titles appKey:(NSString *)appKey)
{
    UINavigationController *navigationController;
    UIViewController *rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    if ([rootViewController isKindOfClass:[UITabBarController class]]) {
        navigationController = (UINavigationController *)((UITabBarController *)rootViewController).viewControllers[tab];
    } else {
        navigationController = (UINavigationController *)rootViewController;
    }
    
    if (!navigationController.delegate) {
        navigationController.delegate = self;
    }
    NSInteger currentCrumb = [navigationController.viewControllers count] - 1;
    if (crumb < currentCrumb) {
        [navigationController popToViewController:navigationController.viewControllers[crumb] animated:true];
    }
    if (crumb > currentCrumb) {
        NSMutableArray *controllers = [navigationController.viewControllers mutableCopy];
        for(NSInteger i = 0; i < crumb - currentCrumb; i++) {
            NSInteger nextCrumb = currentCrumb + i + 1;
            UIViewController *controller = [[NVSceneController alloc] init: nextCrumb tab: tab title: titles[nextCrumb] appKey: appKey];
            [controllers addObject:controller];
        }
        [navigationController setViewControllers:controllers animated:true];
    }
}

@end
