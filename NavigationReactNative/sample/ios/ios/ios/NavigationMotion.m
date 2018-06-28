//
//  NavigationMotion.m
//  ios
//
//  Created by Graham Mendick on 27/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import <UIKit/UIKit.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "AppDelegate.h"

#import "NavigationMotion.h"
#import "Scene.h"

@implementation NavigationMotion

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"Navigated"];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  NSNumber *crumb = @0;
  if ([viewController isKindOfClass:[Scene class]]) {
       crumb = ((Scene *)viewController).crumb;
  }
  [self sendEventWithName:@"Navigated" body:@{@"crumb": crumb}];
}

RCT_EXPORT_METHOD(render:(NSInteger)crumb appKey:(NSString *)appKey)
{
  UINavigationController *navigationController = (UINavigationController *)[UIApplication sharedApplication].keyWindow.rootViewController;
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
      UIViewController *controller = [[Scene alloc] init: @(nextCrumb) appKey: appKey];
      [controllers addObject:controller];
    }
    [navigationController setViewControllers:controllers animated:true];
  }
}

@end
