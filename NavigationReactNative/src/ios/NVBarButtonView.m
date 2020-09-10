#import "NVBarButtonView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>

@implementation NVBarButtonView
{
    NSString *_title;
    UIImage *_image;
}

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

- (void)layoutSubviews
{
    [super layoutSubviews];
    UIView *buttonView = ((UIView *) [self.button valueForKey:@"view"]);
    UIView *barView = buttonView.superview;
    UIView *labelView = buttonView.subviews.count > 0 ? buttonView.subviews[0] : buttonView;
    CGRect labelFrameInBar = [buttonView convertRect:labelView.frame toView:barView];
    self.frame = [barView convertRect:labelFrameInBar toView:nil];
}

- (void)setTitle:(NSString *)title
{
    _title = title;
    self.button.title = title;
}

- (void)setImage:(UIImage *)image
{
    _image = image;
    self.button.image = image;
}

- (void)setSystemItem:(UIBarButtonSystemItem)systemItem
{
    if (systemItem != NSNotFound) {
        self.button = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:systemItem target:self action:@selector(buttonPressed)];
    } else {
        self.button = [[UIBarButtonItem alloc] init];
        self.button.style = UIBarButtonItemStylePlain;
        self.button.target = self;
        self.button.action = @selector(buttonPressed);
        self.button.image = _image;
        self.button.title = _title;
    }
}

-(void)buttonPressed
{
    if (!!self.onPress) {
        self.onPress(nil);
    }
}

@end
