#include "NVNavigationBarState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic NVNavigationBarState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height);
}
#endif

ImageSource NVNavigationBarState::getImageSource() const {
  return imageSource_;
}

ImageRequest const &NVNavigationBarState::getImageRequest() const {
  return *imageRequest_;
}

} // namespace react
} // namespace facebook