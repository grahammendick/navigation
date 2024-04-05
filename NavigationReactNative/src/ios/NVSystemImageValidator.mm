#import "NVSystemImageValidator.h"
#import <UIKit/UIKit.h>

bool isSystemImage(std::string imageName) {
    if (@available(iOS 13.0, *)) {
        return [UIImage systemImageNamed:[NSString stringWithUTF8String:imageName.c_str()]];
    }
    return false;
}
