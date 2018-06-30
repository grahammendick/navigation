//
//  Scene.h
//  ios
//
//  Created by Graham Mendick on 27/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface Scene : UIViewController

@property NSInteger crumb;
@property NSInteger tab;
@property NSString *appKey;

-(id)init: (NSInteger)crumb tab:(NSInteger)tab appKey:(NSString *)appKey;

@end
