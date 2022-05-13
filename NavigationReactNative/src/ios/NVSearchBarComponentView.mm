#ifdef RCT_NEW_ARCH_ENABLED
#import "NVSearchBarComponentView.h"
#import "NVSearchResultsController.h"

#import <react/renderer/components/navigation-react-native/ComponentDescriptors.h>
#import <react/renderer/components/navigation-react-native/EventEmitters.h>
#import <react/renderer/components/navigation-react-native/Props.h>
#import <react/renderer/components/navigation-react-native/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTI18nUtil.h>

using namespace facebook::react;

@interface NVSearchBarComponentView () <RCTNVSearchBarViewProtocol>
@end

@implementation NVSearchBarComponentView
{
    UIView *_reactSubview;
    NSInteger _nativeEventCount;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const NVSearchBarProps>();
        _props = defaultProps;
    }
    return self;
}

- (void)ensureSearchResultsController
{
    if (!_searchController) {
        NVSearchResultsController *viewController = [[NVSearchResultsController alloc] init];
        self.searchController = [[NVSearchController alloc] initWithSearchResultsController:viewController];
        self.searchController.searchBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        self.searchController.searchResultsUpdater = self;
        self.searchController.searchBar.delegate = self;
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [self ensureSearchResultsController];
    const auto &newViewProps = *std::static_pointer_cast<NVSearchBarProps const>(props);
    [super updateProps:props oldProps:oldProps];
}

- (void)updateSearchResultsForSearchController:(UISearchController *)searchController {
    _nativeEventCount++;
    /*if (!!self.onChangeText) {
        self.onChangeText(@{
            @"text": searchController.searchBar.text,
            @"eventCount": @(_nativeEventCount),
        });
    }*/
}

- (void)searchBar:(UISearchBar *)searchBar selectedScopeButtonIndexDidChange:(NSInteger)selectedScope
{
    /*if (!!self.onChangeScopeButton) {
        self.onChangeScopeButton(@{
            @"scopeButton": @(selectedScope),
            @"eventCount": @(_nativeButtonEventCount),
        });
    }*/
}


- (void)observeValueForKeyPath:(NSString*)keyPath ofObject:(id)object change:(NSDictionary*)change context:(void*)context
{
    if (self.searchController.searchBar.text.length == 0 && !_reactSubview.isHidden) {
        _reactSubview.hidden = YES;
    }
}


#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [self ensureSearchResultsController];
    self.searchController.searchResultsController.view = childComponentView;
    _reactSubview = childComponentView;
    [_reactSubview addObserver:self forKeyPath:@"hidden" options:0 context:nil];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [_reactSubview removeObserver:self forKeyPath:@"hidden"];
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
