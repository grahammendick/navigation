#import "UIBarButtonHostView.h"
#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation UIBarButtonHostView

- (id)init
{
  if (self = [super init]) {
    self.button = [[UIBarButtonItem alloc] init];
  }
  return self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  NSMutableArray *buttons = [self.reactViewController.navigationItem.rightBarButtonItems mutableCopy];
  if (!buttons)
    buttons = [[NSMutableArray alloc] init];
  if (![buttons containsObject:self.button])
    [buttons insertObject:self.button atIndex:0];
  [self.reactViewController.navigationItem setRightBarButtonItems:buttons];
}

- (void)didSetProps:(__unused NSArray<NSString *> *)changedProps
{
  self.button.style = UIBarButtonItemStylePlain;
  self.button.title = self.title;
  self.button.target = self;
  self.button.action = @selector(buttonPressed);
}

-(void)buttonPressed
{
  if (!!self.onPress) {
    self.onPress(@{});
  }
}

@end

