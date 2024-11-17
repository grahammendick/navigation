#include "NVNavigationBarState.h"

namespace facebook {
namespace react {

#ifdef ANDROID
folly::dynamic NVNavigationBarState::getDynamic() const {
  return folly::dynamic::object("frameWidth", frameSize.width)(
      "frameHeight", frameSize.height);
}
#endif

void NVNavigationBarState::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  imageLoader_ = imageLoader;
}

std::weak_ptr<void> NVNavigationBarState::getImageLoader()
    const noexcept {
  return imageLoader_;
}

} // namespace react
} // namespace facebook