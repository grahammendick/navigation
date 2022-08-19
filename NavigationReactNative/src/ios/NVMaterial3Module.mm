#import "NVMaterial3Module.h"
#import "navigation-react-native.h"

@implementation NVMaterial3Module

RCT_EXPORT_MODULE(Material3)

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeMaterial3ModuleSpecJSI>(params);
}

@end
