//
//  NavigationMotion.m
//  ios
//
//  Created by Graham Mendick on 27/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "AppDelegate.h"
#import "NavigationMotion.h"
#import "Scene.h"

#import <UIKit/UIKit.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation NavigationMotion

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"Navigate"];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  NSNumber *crumb = @0;
  NSNumber *tab = @0;
  if ([viewController isKindOfClass:[Scene class]]) {
    crumb = ((Scene *)viewController).crumb;
    tab = ((Scene *)viewController).tab;
  }
  [self sendEventWithName:@"Navigate" body:@{@"crumb": crumb, @"tab": crumb}];
}

RCT_EXPORT_METHOD(render:(NSInteger)crumb tab:(NSInteger)tab titles:(NSArray *)titles appKey:(NSString *)appKey)
{
  UITabBarController *tabBarController = (UITabBarController *)[UIApplication sharedApplication].keyWindow.rootViewController;
  UINavigationController *navigationController = (UINavigationController *)tabBarController.viewControllers[tab];
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
      UIViewController *controller = [[Scene alloc] init: @(nextCrumb) tab: @(tab) appKey: appKey];
      controller.title = titles[nextCrumb];
      [controllers addObject:controller];
    }
    [navigationController setViewControllers:controllers animated:true];
  }
}

@end
