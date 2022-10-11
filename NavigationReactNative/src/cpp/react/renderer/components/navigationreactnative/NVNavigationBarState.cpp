#include "NVNavigationBarState.h"

namespace facebook {
namespace react {

ImageSource NVNavigationBarState::getImageSource() const {
  return imageSource_;
}

ImageRequest const &NVNavigationBarState::getImageRequest() const {
  return *imageRequest_;
}

} // namespace react
} // namespace facebook