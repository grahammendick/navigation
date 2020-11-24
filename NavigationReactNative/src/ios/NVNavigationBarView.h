#import <UIKit/UIKit.h>

@interface NVNavigationBarView : UIView

@property (nonatomic, assign) BOOL hidden;
@property (nonatomic, assign) BOOL largeTitle;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *titleFontFamily;
@property (nonatomic, copy) NSString *titleFontWeight;
@property (nonatomic, copy) NSString *titleFontStyle;
@property (nonatomic, copy) NSNumber *titleFontSize;
@property (nonatomic, copy) NSString *backFontFamily;
@property (nonatomic, copy) NSString *backFontWeight;
@property (nonatomic, copy) NSString *backFontStyle;
@property (nonatomic, copy) NSNumber *backFontSize;
@property (nonatomic, copy) UIColor *barTintColor;
@property (nonatomic, copy) UIColor *tintColor;
@property (nonatomic, copy) UIColor *titleColor;
@property (nonatomic, copy) NSString *backTitle;
@property (nonatomic, copy) NSString *backTestID;

-(void)updateStyle;

#define NAVIGATION_BAR ((int) 28)

@end
