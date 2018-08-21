#import "NVBarView.h"
#import "NVBarButtonView.h"

#import <React/UIView+React.h>

@implementation NVBarView

- (id)init
{
    if (self = [super init]) {
        self.buttons = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [self.buttons insertObject:((NVBarButtonView *) subview).button atIndex:atIndex];
    [self setBarButtons:self.buttons];
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    [self.buttons removeObject:((NVBarButtonView *) subview).button];
    [self setBarButtons:self.buttons];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self setBarButtons:self.buttons];
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        [self setBarButtons:nil];
    }
}

-(void)setBarButtons:(NSMutableArray *)buttons
{
}

@end
