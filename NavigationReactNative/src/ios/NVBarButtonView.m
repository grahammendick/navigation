#import "NVBarButtonView.h"

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTFont.h>
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wnullability-completeness"
#import <React/RCTImageLoaderProtocol.h>
#pragma clang diagnostic pop
#import <React/RCTImageSource.h>
#import <React/RCTResizeMode.h>
#import <React/UIView+React.h>

@implementation NVBarButtonView
{
    __weak RCTBridge *_bridge;
    NSString *_testID;
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

- (void)setTitle:(NSString *)title
{
    self.button.title = title;
}

- (void)setSharedElement:(NSString *)sharedElement
{
    self.name = sharedElement;
}

- (void)setTestID:(NSString *)testID
{
    _testID = testID;
    self.button.accessibilityIdentifier = testID;
}

- (void)setImage:(RCTImageSource *)source
{
    if (!!source) {
        if (@available(iOS 13.0, *)) {
            UIImage *sfSymbol = [UIImage systemImageNamed:[source.request.URL lastPathComponent]];
            if (sfSymbol) {
                _button.image = sfSymbol;
                return;
            }
        }
        [[_bridge moduleForName:@"ImageLoader"] loadImageWithURLRequest:source.request size:source.size scale:source.scale clipped:NO resizeMode:RCTResizeModeCover progressBlock:^(int64_t progress, int64_t total){} partialLoadBlock:^(UIImage *image){} completionBlock:^(NSError *error, UIImage *image) {
            dispatch_async(dispatch_get_main_queue(), ^{
                self->_button.image = image;
            });
        }];
    } else {
        _button.image = nil;
    }
}

- (void)setSystemItem:(UIBarButtonSystemItem)systemItem
{
    if (systemItem != NSNotFound) {
        self.button = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:systemItem target:self action:@selector(buttonPressed)];
        self.button.accessibilityIdentifier = _testID;
    }
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [self.button setCustomView:subview];
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    if (self.button.customView == subview)
        [self.button setCustomView:nil];
}

- (void)didUpdateReactSubviews
{
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if ([changedProps containsObject:@"fontFamily"] || [changedProps containsObject:@"fontWeight"]
        || [changedProps containsObject:@"fontStyle"] || [changedProps containsObject:@"fontSize"]
        || [changedProps containsObject:@"tintColor"]) {
        UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
        NSNumber *size = !self.fontSize ? @(UIFont.labelFontSize) : self.fontSize;
        UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:self.fontWeight style:self.fontStyle variant:nil scaleMultiplier:1];
        NSMutableDictionary *attributes = [NSMutableDictionary new];
        if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
            attributes[NSFontAttributeName] = font;
        }
        if (self.tintColor) {
            attributes[NSForegroundColorAttributeName] = self.tintColor;
        }
        self.button.tintColor = self.tintColor;
        [self.button setTitleTextAttributes:attributes forState:UIControlStateNormal];
        [self.button setTitleTextAttributes:attributes forState:UIControlStateSelected];
    }
}

-(void)buttonPressed
{
    if (!!self.onPress) {
        UIView *buttonView = ((UIView *) [self.button valueForKey:@"view"]);
        UIView *barView = buttonView.superview;
        UIView *labelView = buttonView.subviews.count > 0 ? buttonView.subviews[0] : buttonView;
        CGRect labelFrameInBar = [buttonView convertRect:labelView.frame toView:barView];
        self.frame = [barView convertRect:labelFrameInBar toView:nil];
        self.onPress(nil);
    }
}

@end
