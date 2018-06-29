//
//  ApplicationHostDelegate.h
//  ios
//
//  Created by Graham Mendick on 28/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTBridge.h>
#import <UIKit/UIKit.h>

@protocol ApplicationHostDelegate

@end

@interface ApplicationHostDelegate : NSObject <UIApplicationDelegate>

@property (nonatomic, strong) RCTBridge *bridge;

@end

