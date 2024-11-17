#include "NVBarButtonState.h"

namespace facebook {
namespace react {

void NVBarButtonState::setImageLoader(
    std::weak_ptr<void> imageLoader) {
  imageLoader_ = imageLoader;
}

std::weak_ptr<void> NVBarButtonState::getImageLoader()
    const noexcept {
  return imageLoader_;
}

} // namespace react
} // namespace facebook