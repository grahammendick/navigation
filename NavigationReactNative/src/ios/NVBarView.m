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
    [self.buttons insertObject:(NVBarButtonView *) subview atIndex:atIndex];
    [self setBarButtons:self.buttons];
    [((UIViewController<NVSharedElementController> *) self.reactViewController).sharedElements addObject:(NVBarButtonView *) subview];
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    [self.buttons removeObject:(NVBarButtonView *) subview];
    [self setBarButtons:self.buttons];
    [((UIViewController<NVSharedElementController> *) self.reactViewController).sharedElements removeObject:(NVBarButtonView *) subview];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self setBarButtons:self.buttons];
    for (NVBarButtonView *button in self.buttons) {
        [((UIViewController<NVSharedElementController> *) self.reactViewController).sharedElements addObject:button];
    }
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        for (NVBarButtonView *button in self.buttons) {
            [((UIViewController<NVSharedElementController> *) self.reactViewController).sharedElements removeObject:button];
        }
        [self setBarButtons:nil];
    }
}

-(void)setBarButtons:(NSMutableArray *)buttons
{
}

@end
