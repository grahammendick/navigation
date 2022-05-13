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
    NVSearchController *_searchController;
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
        _searchController = [[NVSearchController alloc] initWithSearchResultsController:viewController];
        _searchController.searchBar.semanticContentAttribute = ![[RCTI18nUtil sharedInstance] isRTL] ? UISemanticContentAttributeForceLeftToRight : UISemanticContentAttributeForceRightToLeft;
        _searchController.searchResultsUpdater = self;
        _searchController.searchBar.delegate = self;
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

#pragma mark - RCTComponentViewProtocol

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
