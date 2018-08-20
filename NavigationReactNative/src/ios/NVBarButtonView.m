#import "NVBarButtonView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVBarButtonView

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

- (void)setImage:(UIImage *)image
{
    self.button.image = image;
}

-(void)buttonPressed
{
    if (!!self.onPress) {
        self.onPress(nil);
    }
}

@end
