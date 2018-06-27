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
#import "Scene.h"

@implementation NavigationMotion

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(render:(NSInteger)crumb appKey:(NSString *)appKey)
{
  UINavigationController *navigationController = (UINavigationController *)[UIApplication sharedApplication].keyWindow.rootViewController;

  NSInteger currentCrumb = [navigationController.viewControllers count] - 1;
  if (crumb < currentCrumb) {
    [navigationController popToViewController:navigationController.viewControllers[crumb] animated:true];
  }

  if (crumb > currentCrumb) {
    Scene *scene = [[Scene alloc] init: [NSNumber numberWithInteger:crumb] appKey: @"ios"];
    [navigationController pushViewController:scene animated:true];
  }
}

@end
