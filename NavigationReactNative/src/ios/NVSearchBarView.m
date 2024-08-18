#import "NVSearchBarView.h"
#import "NVSearchResultsController.h"

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTFont.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>

@implementation NVSearchBarView
{
    __weak RCTBridge *_bridge;
    UIView *_reactSubview;
    NSInteger _nativeEventCount;
    NSInteger _nativeActiveEventCount;
    NSInteger _nativeButtonEventCount;
    UIFont *_font;
}

- (id)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super initWithFrame:CGRectZero]) {
        _bridge = bridge;
        NVSearchResultsController *viewController = [[NVSearchResultsController alloc] init];
        self.searchController = [[NVSearchController alloc] initWithSearchResultsController:viewController];
        self.searchController.searchBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        self.searchController.searchResultsUpdater = self;
        self.searchController.searchBar.delegate = self;
        __weak typeof(self) weakSelf = self;
        viewController.boundsDidChangeBlock = ^(CGRect newBounds) {
            [weakSelf notifyForBoundsChange:newBounds];
        };
    }
    return self;
}

- (void)setObscureBackground:(BOOL)obscureBackground
{
    if (@available(iOS 9.1, *)) {
        [self.searchController setObscuresBackgroundDuringPresentation:obscureBackground];
    }
}

- (void)setHideNavigationBar:(BOOL)hideNavigationBar
{
    [self.searchController setHidesNavigationBarDuringPresentation:hideNavigationBar];
}

- (void)setAutoCapitalize:(UITextAutocapitalizationType)autoCapitalize
{
    [self.searchController.searchBar setAutocapitalizationType:autoCapitalize];
}

- (void)setPlaceholder:(NSString *)placeholder
{
    [self.searchController.searchBar setPlaceholder:placeholder];
}

- (void)setBarTintColor:(UIColor *)barTintColor
{
    if (@available(iOS 13.0, *)) {
        [self.searchController.searchBar.searchTextField setBackgroundColor:barTintColor];
    }
}

- (void)setScopeButtons:(NSArray *)scopeButtons
{
    self.searchController.searchBar.scopeButtonTitles = scopeButtons;
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if ([changedProps containsObject:@"fontFamily"] || [changedProps containsObject:@"fontWeight"]
        || [changedProps containsObject:@"fontStyle"] || [changedProps containsObject:@"fontSize"]) {
        UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
        NSNumber *size = !self.fontSize ? @(UIFont.labelFontSize) : self.fontSize;
        _font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:self.fontWeight style:self.fontStyle variant:nil scaleMultiplier:1];
        if (@available(iOS 13.0, *)) {
            [self.searchController.searchBar.searchTextField setFont:_font];
        }
    }
    if (@available(iOS 11.0, *)) {
        [self.reactViewController.navigationItem setHidesSearchBarWhenScrolling:self.hideWhenScrolling];
    }
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag == 0 && ![self.searchController.searchBar.text isEqualToString:_text]) {
        [self.searchController.searchBar setText:_text];
    }
    NSInteger activeEventLag = _nativeActiveEventCount - _mostRecentActiveEventCount;
    if (activeEventLag == 0 && self.searchController.active != _active) {
        [self.searchController setActive:_active];
        if (_active) [self.searchController.searchBar becomeFirstResponder];
    }
    NSInteger buttonEventLag = _nativeButtonEventCount - _mostRecentButtonEventCount;
    if (buttonEventLag == 0 && self.searchController.searchBar.selectedScopeButtonIndex != _scopeButton) {
        self.searchController.searchBar.selectedScopeButtonIndex = _scopeButton;
    }
}

- (void)notifyForBoundsChange:(CGRect)newBounds
{
    if (_reactSubview) {
        [_bridge.uiManager setSize:newBounds.size forView:_reactSubview];
    }
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    self.searchController.searchResultsController.view = subview;
    _reactSubview = subview;
    [_reactSubview addObserver:self forKeyPath:@"hidden" options:0 context:nil];
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    [_reactSubview removeObserver:self forKeyPath:@"hidden"];
    _reactSubview = nil;
}

- (void)observeValueForKeyPath:(NSString*)keyPath ofObject:(id)object change:(NSDictionary*)change context:(void*)context
{
    if (self.searchController.searchBar.text.length == 0 && !_reactSubview.isHidden) {
        _reactSubview.hidden = YES;
    }
}

- (void)didUpdateReactSubviews
{
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    if (@available(iOS 11.0, *)) {
        [self.reactViewController.navigationItem setSearchController:_searchController];
    }
    if (@available(iOS 13.0, *)) {
        [self.searchController.searchBar.searchTextField setFont:_font];
    }
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        if (@available(iOS 11.0, *)) {
            [self.reactViewController.navigationItem setSearchController:nil];
            [self.searchController.searchResultsController dismissViewControllerAnimated:NO completion:nil];
        }
    }
}

- (void)updateSearchResultsForSearchController:(UISearchController *)searchController {
    _nativeEventCount++;
    if (!!self.onChangeText) {
        self.onChangeText(@{
            @"text": searchController.searchBar.text,
            @"eventCount": @(_nativeEventCount),
        });
    }
}

-(BOOL)searchBarShouldBeginEditing:(UISearchBar *)searchBar
{
    _nativeActiveEventCount++;
    if (!!self.onChangeActive) {
        self.onChangeActive(@{
            @"active": @YES,
            @"eventCount": @(_nativeActiveEventCount),
        });
    }
    return YES;
}

- (void)searchBarCancelButtonClicked:(UISearchBar *)searchBar
{
    _nativeActiveEventCount++;
    if (!!self.onChangeActive) {
        self.onChangeActive(@{
            @"active": @NO,
            @"eventCount": @(_nativeActiveEventCount),
        });
    }
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar
{
    if (!!self.onQuery) {
        self.onQuery(@{
            @"text": searchBar.text,
        });
    }
}

- (void)searchBar:(UISearchBar *)searchBar selectedScopeButtonIndexDidChange:(NSInteger)selectedScope
{
    _nativeButtonEventCount++;
    if (!!self.onChangeScopeButton) {
        self.onChangeScopeButton(@{
            @"scopeButton": @(selectedScope),
            @"eventCount": @(_nativeButtonEventCount),
        });
    }
}

- (void)dealloc
{
    if (_reactSubview)
        [_reactSubview removeObserver:self forKeyPath:@"hidden"];
}


@end
