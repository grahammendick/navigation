#include "NVTabBarItemState.h"

namespace facebook {
namespace react {

void NVTabBarItemState::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  imageLoader_ = imageLoader;
}

std::weak_ptr<void> NVTabBarItemState::getImageLoader()
    const noexcept {
  return imageLoader_;
}

} // namespace react
} // namespace facebook