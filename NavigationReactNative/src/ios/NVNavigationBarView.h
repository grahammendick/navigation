#import <UIKit/UIKit.h>

@interface NVNavigationBarView : UIView

@property (nonatomic, assign) BOOL hidden;
@property (nonatomic, assign) BOOL largeTitle;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) UIColor *barTintColor;
@property (nonatomic, copy) UIColor *tintColor;
@property (nonatomic, copy) UIColor *titleColor;
@property (nonatomic, copy) NSString *backTitle;

-(void)updateColors;

#define NAVIGATION_BAR ((int) 28)

@end
