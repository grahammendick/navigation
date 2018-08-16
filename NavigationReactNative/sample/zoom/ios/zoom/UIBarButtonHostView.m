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
  [self.reactViewController.navigationItem setRightBarButtonItem:self.button animated:YES];
}

- (void)didSetProps:(__unused NSArray<NSString *> *)changedProps
{
  self.button.style = UIBarButtonItemStylePlain;
  self.button.title = self.title;
  self.button.target = self;
  self.button.action = @selector(buttonPressed);
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview;
{
  [super willMoveToSuperview:newSuperview];
  if (!newSuperview) {
    self.reactViewController.navigationItem.rightBarButtonItem = nil;
  }
}

-(void)buttonPressed
{
  if (!!self.onPress) {
    self.onPress(@{});
  }
}

@end

