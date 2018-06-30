/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import "Scene.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  self.bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation moduleProvider:nil launchOptions:launchOptions];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

  UIViewController *viewControllerZero = [[Scene alloc] init: @0 tab: @0 appKey: @"iosTabs"];
  viewControllerZero.title = @"Scene";
  viewControllerZero.tabBarItem = [[UITabBarItem alloc] initWithTabBarSystemItem:UITabBarSystemItemSearch tag:0];
  UINavigationController *navigationControllerZero = [[UINavigationController alloc] initWithRootViewController:viewControllerZero];

  UIViewController *viewControllerOne = [[Scene alloc] init: @0 tab: @1 appKey: @"iosTabs"];
  viewControllerOne.title = @"Scene";
  viewControllerOne.tabBarItem = [[UITabBarItem alloc] initWithTabBarSystemItem:UITabBarSystemItemTopRated tag:1];
  UINavigationController *navigationControllerOne = [[UINavigationController alloc] initWithRootViewController:viewControllerOne];

  UITabBarController *tabBarController = [[UITabBarController alloc] init];
  [tabBarController setViewControllers:@[navigationControllerZero, navigationControllerOne]];
  self.window.rootViewController = tabBarController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
