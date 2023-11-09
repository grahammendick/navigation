#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSearchBarComponentView.h"
#import "NVSearchResultsController.h"

#import <react/renderer/components/navigationreactnative/ComponentDescriptors.h>
#import <react/renderer/components/navigationreactnative/EventEmitters.h>
#import <react/renderer/components/navigationreactnative/Props.h>
#import <react/renderer/components/navigationreactnative/RCTComponentViewHelpers.h>
#import <NVSearchBarComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>
#import <React/RCTFont.h>
#import <React/RCTI18nUtil.h>
#import <React/UIView+React.h>

using namespace facebook::react;

@interface NVSearchBarComponentView () <RCTNVSearchBarViewProtocol>
@end

@implementation NVSearchBarComponentView
{
    UISearchController *_oldSearchController;
    UIView *_reactSubview;
    UIFont *_font;
    NSInteger _nativeEventCount;
    NSInteger _nativeActiveEventCount;
    NSInteger _nativeButtonEventCount;
    NVSearchBarShadowNode::ConcreteState::Shared _state;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVSearchBarProps>();
        _props = defaultProps;
    }
    return self;
}

- (void)ensureSearchController
{
    if (!_searchController) {
        [_oldSearchController willMoveToParentViewController:nil];
        [_oldSearchController.view removeFromSuperview];
        [_oldSearchController removeFromParentViewController];
        NVSearchResultsController *viewController = [[NVSearchResultsController alloc] init];
        self.searchController = [[NVSearchController alloc] initWithSearchResultsController:viewController];
        self.searchController.searchBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        self.searchController.searchResultsUpdater = self;
        self.searchController.searchBar.delegate = self;
        id __weak weakSelf = self;
        viewController.boundsDidChangeBlock = ^(CGRect newBounds) {
            [weakSelf notifyForBoundsChange:newBounds];
        };
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self ensureSearchController];
    const auto &newViewProps = *std::static_pointer_cast<NVSearchBarProps const>(props);
    NSString *text = [[NSString alloc] initWithUTF8String: newViewProps.text.c_str()];
    _fontFamily = [[NSString alloc] initWithUTF8String: newViewProps.fontFamily.c_str()];
    _fontFamily = _fontFamily.length ? _fontFamily : nil;
    _fontWeight = [[NSString alloc] initWithUTF8String: newViewProps.fontWeight.c_str()];
    _fontWeight = _fontWeight.length ? _fontWeight : nil;
    _fontStyle = [[NSString alloc] initWithUTF8String: newViewProps.fontStyle.c_str()];
    _fontStyle = _fontStyle.length ? _fontStyle : nil;
    _fontSize = @(newViewProps.fontSize);
    _fontSize = [_fontSize intValue] >= 0 ? _fontSize : nil;
    UIFont *baseFont = !self.fontFamily ? [UIFont systemFontOfSize:UIFont.labelFontSize] : nil;
    NSNumber *size = !self.fontSize ? @(UIFont.labelFontSize) : self.fontSize;
    _font = [RCTFont updateFont:baseFont withFamily:self.fontFamily size:size weight:self.fontWeight style:self.fontStyle variant:nil scaleMultiplier:1];
    if (@available(iOS 13.0, *)) {
        [self.searchController.searchBar.searchTextField setFont:_font];
    }
    _mostRecentEventCount = newViewProps.mostRecentEventCount;
    NSInteger eventLag = _nativeEventCount - _mostRecentEventCount;
    if (eventLag == 0 && ![self.searchController.searchBar.text isEqualToString:text]) {
        [self.searchController.searchBar setText:text];
    }
    BOOL active = newViewProps.active;
    _mostRecentActiveEventCount = newViewProps.mostRecentActiveEventCount;
    NSInteger eventActiveLag = _nativeActiveEventCount - _mostRecentActiveEventCount;
    if (eventActiveLag == 0 && self.searchController.active != active) {
        [self.searchController setActive:active];
        if (active) [self.searchController.searchBar becomeFirstResponder];
    }
    NSString *autoCapitalize = [[NSString alloc] initWithUTF8String: newViewProps.autoCapitalize.c_str()];
    [self.searchController.searchBar setAutocapitalizationType:[self autoCapitalizationType:autoCapitalize]];
    NSString *placeholder = [[NSString alloc] initWithUTF8String: newViewProps.placeholder.c_str()];
    if (self.searchController.searchBar.placeholder != placeholder)
        [self.searchController.searchBar setPlaceholder:placeholder];
    [self.searchController setObscuresBackgroundDuringPresentation:newViewProps.obscureBackground];
    [self.searchController setHidesNavigationBarDuringPresentation:newViewProps.hideNavigationBar];
    if (@available(iOS 13.0, *)) {
        [self.searchController.searchBar.searchTextField setBackgroundColor:RCTUIColorFromSharedColor(newViewProps.barTintColor)];
    }
    _hideWhenScrolling = newViewProps.hideWhenScrolling;
    [self.reactViewController.navigationItem setHidesSearchBarWhenScrolling:_hideWhenScrolling];
    NSMutableArray *scopeButtons = [[NSMutableArray alloc] init];
    for (auto i = 0; i < newViewProps.scopeButtons.size(); i++) {
        NSString *scopeButton = [[NSString alloc] initWithUTF8String: newViewProps.scopeButtons[i].c_str()];
        [scopeButtons addObject:scopeButton];
    }
    _mostRecentButtonEventCount = newViewProps.mostRecentButtonEventCount;
    NSInteger eventButtonLag = _nativeButtonEventCount - _mostRecentButtonEventCount;
    NSInteger scopeButton = newViewProps.scopeButton;
    if (eventButtonLag == 0 && self.searchController.searchBar.selectedScopeButtonIndex != scopeButton) {
        self.searchController.searchBar.selectedScopeButtonIndex = scopeButton;
    }
    self.searchController.searchBar.scopeButtonTitles = scopeButtons;
    [super updateProps:props oldProps:oldProps];
}

-(UITextAutocapitalizationType)autoCapitalizationType:(NSString*)val
{
    if ([val isEqualToString:@"none"]) return UITextAutocapitalizationTypeNone;
    if ([val isEqualToString:@"words"]) return UITextAutocapitalizationTypeWords;
    if ([val isEqualToString:@"sentences"]) return UITextAutocapitalizationTypeSentences;
    if ([val isEqualToString:@"allCharacters"]) return UITextAutocapitalizationTypeAllCharacters;
    return UITextAutocapitalizationTypeSentences;
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    [self.reactViewController.navigationItem setSearchController:_searchController];
    if (@available(iOS 13.0, *)) {
        [self.searchController.searchBar.searchTextField setFont:_font];
    }
}

- (void)willMoveToSuperview:(nullable UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];
    if (!newSuperview) {
        [self.reactViewController.navigationItem setSearchController:nil];
        [self.searchController.searchResultsController dismissViewControllerAnimated:NO completion:nil];
    }
}

- (void)updateSearchResultsForSearchController:(UISearchController *)searchController {
    _nativeEventCount++;
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVSearchBarEventEmitter const>(_eventEmitter)
            ->onChangeText(NVSearchBarEventEmitter::OnChangeText{
                .text = std::string([_searchController.searchBar.text UTF8String]),
                .eventCount = static_cast<int>(_nativeEventCount),
            });
    }
}

-(BOOL)searchBarShouldBeginEditing:(UISearchBar *)searchBar
{
    _nativeActiveEventCount++;
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVSearchBarEventEmitter const>(_eventEmitter)
            ->onChangeActive(NVSearchBarEventEmitter::OnChangeActive{
                .active = true,
                .eventCount = static_cast<int>(_nativeActiveEventCount),
            });
    }
    return YES;
}

- (void)searchBarCancelButtonClicked:(UISearchBar *)searchBar
{
    _nativeActiveEventCount++;
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVSearchBarEventEmitter const>(_eventEmitter)
            ->onChangeActive(NVSearchBarEventEmitter::OnChangeActive{
                .active = false,
                .eventCount = static_cast<int>(_nativeActiveEventCount),
            });
    }
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar
{
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVSearchBarEventEmitter const>(_eventEmitter)
            ->onQuery(NVSearchBarEventEmitter::OnQuery{
                .text = std::string([searchBar.text UTF8String]),
            });
    }
}

- (void)searchBar:(UISearchBar *)searchBar selectedScopeButtonIndexDidChange:(NSInteger)selectedScope
{
    _nativeButtonEventCount++;
    if (_eventEmitter != nullptr) {
        std::static_pointer_cast<NVSearchBarEventEmitter const>(_eventEmitter)
            ->onChangeScopeButton(NVSearchBarEventEmitter::OnChangeScopeButton{
                .scopeButton = static_cast<int>(selectedScope),
                .eventCount = static_cast<int>(_nativeButtonEventCount),
            });
    }
}

- (void)observeValueForKeyPath:(NSString*)keyPath ofObject:(id)object change:(NSDictionary*)change context:(void*)context
{
    if (self.searchController.searchBar.text.length == 0 && !_reactSubview.isHidden) {
        _reactSubview.hidden = YES;
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _state.reset();
    _nativeEventCount = 0;
    _nativeActiveEventCount = 0;
    _nativeButtonEventCount = 0;
    _oldSearchController = _searchController;
    _searchController = nil;
    _reactSubview = nil;
}

- (void)notifyForBoundsChange:(CGRect)newBounds
{
    if (_state != nullptr) {
        auto newState = NVSearchBarState{RCTSizeFromCGSize(newBounds.size)};
        _state->updateState(std::move(newState));
    }
}

- (void)dealloc
{
    [_reactSubview removeObserver:self forKeyPath:@"hidden"];
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self ensureSearchController];
    self.searchController.searchResultsController.view = childComponentView;
    _reactSubview = childComponentView;
    [_reactSubview addObserver:self forKeyPath:@"hidden" options:0 context:nil];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [_reactSubview removeObserver:self forKeyPath:@"hidden"];
    self.searchController.searchResultsController.view = nil;
}

- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState
{
    _state = std::static_pointer_cast<const NVSearchBarShadowNode::ConcreteState>(state);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NVSearchBarComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NVSearchBarCls(void)
{
  return NVSearchBarComponentView.class;
}
#endif
