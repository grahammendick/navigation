#include "NVTabBarItemState.h"

namespace facebook {
namespace react {

ImageSource NVTabBarItemState::getImageSource() const {
  return imageSource_;
}

ImageRequest const &NVTabBarItemState::getImageRequest() const {
  return *imageRequest_;
}

} // namespace react
} // namespace facebook