//
//  ApplicationBridgeDelegate.h
//  ios
//
//  Created by Graham Mendick on 27/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTBridge.h>
#import <UIKit/UIKit.h>

@protocol ApplicationBridgeDelegate

@end

@interface ApplicationBridgeDelegate : NSObject <UIApplicationDelegate>

@property (nonatomic, strong) RCTBridge *bridge;

@end

