#import "NVBarButtonView.h"

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTFont.h>
#import <React/RCTImageLoaderProtocol.h>
#import <React/RCTImageSource.h>
#import <React/RCTResizeMode.h>
#import <React/UIView+React.h>

@implementation NVBarButtonView
{
    __weak RCTBridge *_bridge;
    NSString *_title;
    NSString *_testID;
    UIImage *_image;
}

- (id)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super init]) {
        _bridge = bridge;
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

- (void)setTestID:(NSString *)testID
{
    _testID = testID;
    self.button.accessibilityIdentifier = testID;
}

- (void)setImage:(RCTImageSource *)source
{
    if (!!source) {
        [[_bridge moduleForName:@"ImageLoader"] loadImageWithURLRequest:source.request size:source.size scale:source.scale clipped:NO resizeMode:RCTResizeModeCover progressBlock:nil partialLoadBlock:nil completionBlock:^(NSError *error, UIImage *image) {
            dispatch_async(dispatch_get_main_queue(), ^{
                self -> _image = image;
                self -> _button.image = image;
            });
        }];
    } else {
        _image = nil;
        _button.image = nil;
    }
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
        self.button.accessibilityIdentifier = _testID;
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
