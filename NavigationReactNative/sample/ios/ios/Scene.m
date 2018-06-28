//
//  Scene.m
//  ios
//
//  Created by Graham Mendick on 27/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Scene.h"
#import "ApplicationHostDelegate.h"

#import <UIKit/UIKit.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation Scene

- (id)init: (NSNumber *)crumb appKey:(NSString *)appKey {
  if (self = [super init]) {
    self.crumb = crumb;
    self.appKey = appKey;
  }
  return self;
}

- (void)loadView
{
  ApplicationHostDelegate *delegate = (ApplicationHostDelegate *)[[UIApplication sharedApplication] delegate];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:delegate.bridge moduleName: self.appKey initialProperties:@{ @"crumb": self.crumb }];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.view = rootView;
  self.title = @"Scene Two";
}

@end
