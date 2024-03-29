#import "NVSystemImageValidator.h"
#import <UIKit/UIKit.h>

bool isSystemImage(std::string imageName) {
  NSString *imageNameNS = [NSString stringWithUTF8String:imageName.c_str()];
  UIImage *image = [UIImage systemImageNamed:imageNameNS];
  return image != nil;
}
