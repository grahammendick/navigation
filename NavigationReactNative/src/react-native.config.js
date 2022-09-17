module.exports = {
  dependency: {
    platforms: {
      android: {
        componentDescriptors: [
          'NVActionBarComponentDescriptor',
          'NVBarButtonComponentDescriptor',
          'NVBottomAppBarComponentDescriptor',
          'NVBottomSheetComponentDescriptor',
          'NVCollapsingBarComponentDescriptor',
          'NVCoordinatorLayoutComponentDescriptor',
          'NVExtendedFloatingActionButtonComponentDescriptor',
          'NVFloatingActionButtonComponentDescriptor',
          'NVNavigationBarComponentDescriptor',
          'NVNavigationStackComponentDescriptor',
          'NVSceneComponentDescriptor',
          'NVSearchBarComponentDescriptor',
          'NVSharedElementComponentDescriptor',
          'NVStatusBarComponentDescriptor',
          'NVTabBarItemComponentDescriptor',
          'NVTabBarComponentDescriptor',
          'NVTabBarPagerComponentDescriptor',
          'NVTabBarPagerRTLComponentDescriptor',
          'NVTabLayoutComponentDescriptor',
          'NVTabLayoutRTLComponentDescriptor',
          'NVTabNavigationComponentDescriptor',
          'NVTitleBarComponentDescriptor',
          'NVToolbarComponentDescriptor',
        ],
        cmakeListsPath: "../cpp/CMakeLists.txt",
        libraryName: "navigationreactnative"
      },
    },
  },
};