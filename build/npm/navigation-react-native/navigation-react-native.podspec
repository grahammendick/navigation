# folly_version must match the version used in React Native
# See folly_version in react-native/React/FBReactNativeSpec/FBReactNativeSpec.podspec
folly_version = '2021.06.28.00-v2'
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |spec|
  spec.name         = "navigation-react-native"
  spec.version      = "8.9.2"
  spec.license      = "Apache-2.0"
  spec.summary      = "React Native plugin for the Navigation router"
  spec.homepage     = "http://grahammendick.github.io/navigation/"
  spec.platform     = :ios, "9.0"
  spec.author       = "Graham Mendick"
  spec.source       = { :git => "git://github.com/grahammendick/navigation.git", :tag => "v8.9.2-NavigationReactNative" }
  spec.source_files = "ios/**/*.{h,m,mm}"
  spec.dependency "React-Core"
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    spec.source_files = "ios/**/*.{h,m,mm}", "cpp/**/*.{h,cpp}"
    spec.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
    spec.pod_target_xcconfig    = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    }
    spec.dependency "React-RCTFabric"
    spec.dependency "React-Codegen"
    spec.dependency "RCT-Folly", folly_version
    spec.dependency "RCTRequired"
    spec.dependency "RCTTypeSafety"
    spec.dependency "ReactCommon/turbomodule/core"
  end
end
