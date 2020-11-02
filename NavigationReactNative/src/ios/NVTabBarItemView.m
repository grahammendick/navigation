#import "NVTabBarItemView.h"
#import "NVNavigationStackView.h"

#import <React/RCTBridge.h>
#import <React/RCTFont.h>
#import <React/RCTImageLoaderProtocol.h>
#import <React/RCTImageSource.h>
#import <React/RCTResizeMode.h>
#import <React/UIView+React.h>

@implementation NVTabBarItemView
{
    __weak RCTBridge *_bridge;
    NSString *_title;
    UIImage *_image;
}

- (id)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super init]) {
        _bridge = bridge;
        self.tab = [[UITabBarItem alloc] init];
    }
    return self;
}

- (void)setTitle:(NSString *)title
{
    _title = title;
    self.tab.title = title;
}

- (void)setBadge:(NSString *)badge
{
    self.tab.badgeValue = badge;
}

- (void)setBadgeColor:(UIColor *)badgeColor
{
    if (@available(iOS 10.0, *)) {
        self.tab.badgeColor = badgeColor;
    }
}

- (void)setImage:(RCTImageSource *)source
{
    if (!!source) {
        [[_bridge moduleForName:@"ImageLoader"] loadImageWithURLRequest:source.request size:source.size scale:source.scale clipped:NO resizeMode:RCTResizeModeCover progressBlock:nil partialLoadBlock:nil completionBlock:^(NSError *error, UIImage *image) {
            dispatch_async(dispatch_get_main_queue(), ^{
                self -> _image = image;
                self -> _tab.image = image;
            });
        }];
    } else {
        _image = nil;
        _tab.image = nil;
    }
}

- (void)setSystemItem:(UITabBarSystemItem)systemItem
{
    UITabBarItem *oldTab = self.tab;
    if (systemItem != NSNotFound) {
        self.tab = [[UITabBarItem alloc] initWithTabBarSystemItem:systemItem tag:0];
    } else {
        self.tab = [[UITabBarItem alloc] init];
        self.tab.image = _image;
        self.tab.title = _title;
    }
    self.tab.badgeValue = oldTab.badgeValue;
    if (@available(iOS 10.0, *)) {
        self.tab.badgeColor = oldTab.badgeColor;
    }
    self.navigationController.tabBarItem = self.tab;
}

- (void)setTestID:(NSString *)testID
{
    self.tab.accessibilityIdentifier = testID;
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if ([changedProps containsObject:@"fontFamily"] || [changedProps containsObject:@"fontWeight"]
        || [changedProps containsObject:@"fontStyle"] || [changedProps containsObject:@"fontSize"]) {
        UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
        NSNumber *size = !self.fontSize ? @10 : self.fontSize;
        NSString *weight = !self.fontWeight ? @"500" : self.fontWeight;
        UIFont *font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:weight style:self.fontStyle variant:nil scaleMultiplier:1];
        NSMutableDictionary *attributes = [NSMutableDictionary new];
        if (self.fontFamily || self.fontWeight || self.fontStyle || self.fontSize) {
            attributes[NSFontAttributeName] = font;
        }
        [self.tab setTitleTextAttributes:attributes forState:UIControlStateNormal];
    }
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    if ([subview class] == [NVNavigationStackView class])
        self.navigationController = [(NVNavigationStackView *) subview navigationController];
    self.navigationController.tabBarItem = self.tab;
}

@end
