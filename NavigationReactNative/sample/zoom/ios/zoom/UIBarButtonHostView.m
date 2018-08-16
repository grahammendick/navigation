#import "UIBarButtonHostView.h"
#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation UIBarButtonHostView

- (id)init
{
  if (self = [super init]) {
  }
  return self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithTitle:self.title style:UIBarButtonItemStylePlain target:self action:@selector(buttonPressed)];
  [self.reactViewController.navigationItem setRightBarButtonItem:item animated:YES];
}

-(void)buttonPressed
{
}

@end

