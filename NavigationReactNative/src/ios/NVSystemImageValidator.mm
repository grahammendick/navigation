#import "NVSystemImageValidator.h"
#import <UIKit/UIKit.h>

bool isSystemImage(std::string imageName) {
    return [UIImage systemImageNamed:[NSString stringWithUTF8String:imageName.c_str()]];
}
