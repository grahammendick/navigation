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
#import "ApplicationBridgeDelegate.h"

@implementation NavigationMotion

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(render:(NSInteger)crumb appKey:(NSString *)appKey)
{
  ApplicationBridgeDelegate *delegate = (ApplicationBridgeDelegate *)[[UIApplication sharedApplication] delegate];
  UINavigationController *navigationController = (UINavigationController *)[UIApplication sharedApplication].keyWindow.rootViewController;

  NSInteger currentCrumb = [navigationController.viewControllers count] - 1;
  if (crumb < currentCrumb) {
    [navigationController popToViewController:navigationController.viewControllers[crumb] animated:true];
  }

  if (crumb > currentCrumb) {
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:delegate.bridge moduleName:@"ios" initialProperties:@{ @"crumb": [NSNumber numberWithInteger:crumb] }];
    rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    rootViewController.title = @"Scene Two";
    [navigationController pushViewController:rootViewController animated:true];
  }
}

@end
