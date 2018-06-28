//
//  NavigationMotion.h
//  ios
//
//  Created by Graham Mendick on 27/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import <UIKit/UIKit.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface NavigationMotion : RCTEventEmitter <RCTBridgeModule, UINavigationControllerDelegate>
@end
