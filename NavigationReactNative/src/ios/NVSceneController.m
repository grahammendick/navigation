#import "NVSceneController.h"
#import "NVApplicationHostDelegate.h"

#import <UIKit/UIKit.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation NVSceneController

- (id)init: (NSInteger)crumb tab:(NSInteger)tab title:(NSString *)title appKey:(NSString *)appKey navigationModule:(NavigationModule *)navigationModule {
    if (self = [super init]) {
        self.crumb = crumb;
        self.tab = tab;
        self.title = title;
        self.appKey = appKey;
        self.navigationModule = navigationModule;
    }
    return self;
}

-(void)didMoveToParentViewController:(UIViewController *)parent
{
    [super didMoveToParentViewController:parent];
    if (self.navigationModule && !parent) {
        [self.navigationModule sendEventWithName:@"Navigate" body:@{@"crumb": @(self.crumb), @"tab": @(self.tab)}];
    }
}

- (void)loadView
{
    NVApplicationHostDelegate *delegate = (NVApplicationHostDelegate *)[[UIApplication sharedApplication] delegate];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:delegate.bridge moduleName: self.appKey initialProperties:@{ @"crumb": @(self.crumb), @"tab": @(self.tab) }];
    rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
    self.view = rootView;
}

@end
