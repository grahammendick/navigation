let supportsCodegenConfig = false;
try {
  const rnCliAndroidVersion =
    require('@react-native-community/cli-platform-android/package.json').version;
  const [major] = rnCliAndroidVersion.split('.');
  supportsCodegenConfig = major >= 9;
} catch (e) {
}

module.exports = {
  dependency: {
    platforms: {
      android: supportsCodegenConfig ? {
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
        cmakeListsPath: "../cpp/CMakeLists.txt"
      } : {},
    },
  },
};