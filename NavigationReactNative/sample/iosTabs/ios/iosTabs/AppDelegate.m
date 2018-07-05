/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import "NVSceneController.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  self.bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation moduleProvider:nil launchOptions:launchOptions];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

  UIViewController *viewControllerZero = [[NVSceneController alloc] init: 0 tab: 0 title: @"Scene" appKey: @"iosTabs"];
  UINavigationController *navigationControllerZero = [[UINavigationController alloc] initWithRootViewController:viewControllerZero];
  navigationControllerZero.tabBarItem = [[UITabBarItem alloc] initWithTabBarSystemItem:UITabBarSystemItemSearch tag:0];

  UIViewController *viewControllerOne = [[NVSceneController alloc] init: 0 tab: 1 title: @"Scene" appKey: @"iosTabs"];
  UINavigationController *navigationControllerOne = [[UINavigationController alloc] initWithRootViewController:viewControllerOne];
  navigationControllerOne.tabBarItem = [[UITabBarItem alloc] initWithTabBarSystemItem:UITabBarSystemItemTopRated tag:1];

  UITabBarController *tabBarController = [[UITabBarController alloc] init];
  [tabBarController setViewControllers:@[navigationControllerZero, navigationControllerOne]];
  self.window.rootViewController = tabBarController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
