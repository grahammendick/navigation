//
//  Scene.h
//  ios
//
//  Created by Graham Mendick on 27/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface Scene : UIViewController

@property NSNumber *crumb;
@property NSString *appKey;

-(id)init: (NSNumber *)crumb appKey:(NSString *)appKey;

@end
