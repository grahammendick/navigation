/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "NVSceneController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  self.bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation moduleProvider:nil launchOptions:launchOptions];  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

  NSArray *tabs = @[@"Home", @"Notifications"];
  NSString *appKey = @"twitter";

  NSMutableArray *controllers = [[NSMutableArray alloc] init];
  for(NSInteger tab = 0; tab < [tabs count]; tab++) {
    UIViewController *sceneController = [[NVSceneController alloc] init:0 tab:tab title:tabs[tab] appKey:appKey];
    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:sceneController];
    navigationController.tabBarItem = [[UITabBarItem alloc] initWithTitle:tabs[tab] image:nil tag:tab];
    [controllers addObject:navigationController];
  }

  UITabBarController *tabBarController = [[UITabBarController alloc] init];
  [tabBarController setViewControllers:controllers];
  self.window.rootViewController = tabBarController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
