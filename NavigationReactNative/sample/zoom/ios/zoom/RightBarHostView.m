#import "RightBarHostView.h"

#import <React/UIView+React.h>
#import "UIBarButtonHostView.h"

@implementation RightBarHostView

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
  [self.buttons insertObject:((UIBarButtonHostView *) subview).button atIndex:atIndex];
}

- (void)removeReactSubview:(UIView *)subview
{
  [super removeReactSubview:subview];
  [self.buttons removeObject:((UIBarButtonHostView *) subview).button];
  [self.reactViewController.navigationItem setRightBarButtonItems:self.buttons];
}

- (void)didMoveToWindow
 {
   [super didMoveToWindow];
   [self.reactViewController.navigationItem setRightBarButtonItems:self.buttons];
}

@end

