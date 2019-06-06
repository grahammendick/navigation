#import <UIKit/UIKit.h>

@interface NVTabBarItemView : UIView

@property UITabBarItem *tab;
@property (nonatomic, assign) NSString *title;
@property (nonatomic, assign) UIImage *image;
@property (nonatomic, assign) UITabBarSystemItem systemItem;
@property (nonatomic, strong) UINavigationController *navigationController;

@end
