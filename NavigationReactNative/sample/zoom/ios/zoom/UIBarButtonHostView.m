#import "UIBarButtonHostView.h"
#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation UIBarButtonHostView

- (id)init
{
  if (self = [super init]) {
    self.button = [[UIBarButtonItem alloc] init];
    self.button.style = UIBarButtonItemStylePlain;
    self.button.target = self;
    self.button.action = @selector(buttonPressed);
  }
  return self;
}

- (void)setTitle:(NSString *)title
{
  self.button.title = title;
}

-(void)buttonPressed
{
  if (!!self.onPress) {
    self.onPress(@{});
  }
}

@end

