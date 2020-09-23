#import "NVBarButtonView.h"

#import <UIKit/UIKit.h>
#import <React/RCTFont.h>
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

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if ([changedProps containsObject:@"fontFamily"] || [changedProps containsObject:@"fontWeight"]
        || [changedProps containsObject:@"fontStyle"] || [changedProps containsObject:@"fontSize"]) {
        UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
        NSNumber *size = !self.fontSize ? @(UIFont.labelFontSize) : self.fontSize;
        UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:self.fontWeight style:self.fontStyle variant:nil scaleMultiplier:1];
        NSMutableDictionary *attributes = [NSMutableDictionary new];
        if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
            attributes[NSFontAttributeName] = font;
        }
        [self.button setTitleTextAttributes:attributes forState:UIControlStateNormal];
        [self.button setTitleTextAttributes:attributes forState:UIControlStateSelected];
    }
}

-(void)buttonPressed
{
    if (!!self.onPress) {
        self.onPress(nil);
    }
}

@end
