#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NVTabBarItemView : UIView

@property UITabBarItem *tab;
@property (nonatomic, assign) NSString *title;
@property (nonatomic, assign) UIImage *image;
@property (nonatomic, assign) UITabBarSystemItem systemItem;
@property (nonatomic, strong) UINavigationController *navigationController;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end
