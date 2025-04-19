Pod::Spec.new do |spec|
  spec.name         = "navigation-react-native"
  spec.version      = "9.31.0"
  spec.license      = "Apache-2.0"
  spec.summary      = "React Native plugin for the Navigation router"
  spec.homepage     = "http://grahammendick.github.io/navigation/"
  spec.platform     = :ios, "9.0"
  spec.author       = "Graham Mendick"
  spec.source       = { :git => "git://github.com/grahammendick/navigation.git", :tag => "v9.31.0-NavigationReactNative" }
  spec.source_files = "ios/**/*.{h,m,mm}"
  spec.dependency "React-Core"
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    spec.platform   = :ios, "11.0"
    spec.source_files = "ios/**/*.{h,m,mm}", "cpp/react/**/*.{h,cpp}"
    install_modules_dependencies(spec)
  end
end
