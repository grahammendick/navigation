#import "NVRightBarView.h"
#import "NVBarButtonView.h"

#import <React/UIView+React.h>

@implementation NVRightBarView

- (id)init
{
    if (self = [super init]) {
        self.buttons = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [self.buttons insertObject:((NVBarButtonView *) subview).button atIndex:atIndex];
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    [self.buttons removeObject:((NVBarButtonView *) subview).button];
    [self.reactViewController.navigationItem setRightBarButtonItems:self.buttons];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self.reactViewController.navigationItem setRightBarButtonItems:self.buttons];
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview;
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        [self.reactViewController.navigationItem setRightBarButtonItems:nil];
    }
}

@end



//
//  NVRightBarView.m
//  NavigationReactNative
//
//  Created by Graham Mendick on 20/08/2018.
//  Copyright © 2018 Graham Mendick. All rights reserved.
//

#import <Foundation/Foundation.h>
