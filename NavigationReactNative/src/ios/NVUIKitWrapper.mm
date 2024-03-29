#import "NVUIKitWrapper.h"
#import <UIKit/UIKit.h>

bool isSystemImage(const std::string& imageName) {
  NSString *imageNameNS = [NSString stringWithUTF8String:imageName.c_str()];
  UIImage *image = [UIImage systemImageNamed:imageNameNS];
  return image != nil;
}
