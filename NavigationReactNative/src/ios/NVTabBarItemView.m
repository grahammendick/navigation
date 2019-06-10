#import "NVTabBarItemView.h"
#import "NVNavigationStackView.h"

#import <React/UIView+React.h>

@implementation NVTabBarItemView

- (id)init
{
    if (self = [super init]) {
        self.tab = [[UITabBarItem alloc] init];
    }
    return self;
}

- (void)setTitle:(NSString *)title
{
    self.tab.title = title;
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
    self.navigationController = [(NVNavigationStackView *) subview navigationController];
    self.navigationController.tabBarItem = self.tab;
}

@end
