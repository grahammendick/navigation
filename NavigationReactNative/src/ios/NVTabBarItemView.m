#import "NVTabBarItemView.h"
#import "NVNavigationStackView.h"

#import <React/UIView+React.h>
#import <React/RCTConvert.h>

@implementation NVTabBarItemView {
    NSString *_fontFamily;
    float _fontSize;
}

- (id)init
{
    if (self = [super init]) {
        self.tab = [[UITabBarItem alloc] init];
        _fontFamily = @"system";
        _fontSize = 10;
    }
    return self;
}

- (void)setTitle:(NSString *)title
{
    self.tab.title = title;
}

- (void)setFontFamily:(NSString *)fontFamily
{
    if (@available(iOS 5.0, *)) {
        _fontFamily = fontFamily;
        [self.tab setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:
                                          [UIFont fontWithName:fontFamily size:_fontSize], NSFontAttributeName,
                                          nil]
                                forState:UIControlStateNormal];
    }
}

- (void)setFontSize:(float)fontSize
{
    if (@available(iOS 5.0, *)) {
        _fontSize = fontSize;
        if ([_fontFamily isEqualToString:@"system"]) {
            [self.tab setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:
                                              [UIFont boldSystemFontOfSize:fontSize], NSFontAttributeName,
                                              nil]
                                    forState:UIControlStateNormal];
        } else {
            [self.tab setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:
                                              [UIFont fontWithName:_fontFamily size:fontSize], NSFontAttributeName,
                                              nil]
                                    forState:UIControlStateNormal];
        }
    }
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

- (void)setBadgeStyle:(NSDictionary *)styles
{
    if (@available(iOS 10.0, *)) {
        __block NSString *fontFamily = @"system";
        __block float fontSize = 13;
        NSMutableDictionary *finalStyle = [[NSMutableDictionary alloc]init];
        NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc]init];

        [styles enumerateKeysAndObjectsUsingBlock:^(id key, id value, BOOL* stop) {
            if ([key isEqualToString:@"fontFamily"]) {
                fontFamily = value;
                if ([fontFamily isEqualToString:@"system"]) {
                    [finalStyle setValue:[UIFont systemFontOfSize:fontSize] forKey:NSFontAttributeName];
                } else {
                    [finalStyle setValue:[UIFont fontWithName:fontFamily size:fontSize] forKey:NSFontAttributeName];
                }
            } else if ([key isEqualToString:@"fontSize"]) {
                fontSize = [value floatValue];
                if ([fontFamily isEqualToString:@"system"]) {
                    [finalStyle setValue:[UIFont systemFontOfSize:fontSize] forKey:NSFontAttributeName];
                } else {
                    [finalStyle setValue:[UIFont fontWithName:fontFamily size:fontSize] forKey:NSFontAttributeName];
                }
            } else if ([key isEqualToString:@"color"]) {
                [finalStyle setValue:[RCTConvert UIColor:value] forKey:NSForegroundColorAttributeName];
            } else if ([key isEqualToString:@"letterSpacing"]) {
                [finalStyle setValue:value forKey:NSKernAttributeName];
            } else if ([key isEqualToString:@"lineHeight"]) {
                paragraphStyle.lineSpacing = [value floatValue];
            } else if ([key isEqualToString:@"textAlign"]) {
                if ([value isEqualToString:@"auto"]) {
                    paragraphStyle.alignment = NSTextAlignmentNatural;
                } else if ([value isEqualToString:@"center"]) {
                    paragraphStyle.alignment = NSTextAlignmentCenter;
                } else if ([value isEqualToString:@"justify"]) {
                    paragraphStyle.alignment = NSTextAlignmentJustified;
                } else if ([value isEqualToString:@"left"]) {
                    paragraphStyle.alignment = NSTextAlignmentLeft;
                } else if ([value isEqualToString:@"right"]) {
                    paragraphStyle.alignment = NSTextAlignmentRight;
                }
            }
        }];
        
        [finalStyle setValue:paragraphStyle forKey:NSParagraphStyleAttributeName];

        [self.tab setBadgeTextAttributes:finalStyle forState: UIControlStateNormal];
    }
}

- (void)setImage:(UIImage *)image
{
    self.tab.image = image;
}

- (void)setSystemItem:(UITabBarSystemItem)systemItem
{
    self.tab = [[UITabBarItem alloc] initWithTabBarSystemItem:systemItem tag:0];
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    if ([subview class] == [NVNavigationStackView class])
        self.navigationController = [(NVNavigationStackView *) subview navigationController];
    self.navigationController.tabBarItem = self.tab;
}

@end
